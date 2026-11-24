import db from "../config/db";
import { ApiError } from "../utils/ApiError";
import {
    formatDonorId,
    formatDonationId
} from "../utils/ids";
import {
    getNextEligibleDate,
    getDaysSince
} from "../utils/dates";

type DonorInput = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    sex: "M" | "F";
    address: string;
    phone: string;
    wants_reminder?: boolean;
    blood_type?: string | null;
};

type DonorQuery = {
    page?: string;
    limit?: string;
    search?: string;
    bloodType?: string;
    reminder?: string;
    from?: string;
    to?: string;
};

function getAllDonors(query: DonorQuery) {
    const page = Math.max(
        Number(query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(Number(query.limit) || 5, 1),
        100
    );

    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (query.search) {
        conditions.push(`
            (
                CAST(d.donor_id AS TEXT) LIKE ?
                OR d.first_name LIKE ?
                OR d.last_name LIKE ?
                OR (
                    d.first_name || ' ' || d.last_name
                ) LIKE ?
                OR d.phone LIKE ?
            )
        `);

        const search = `%${query.search}%`;

        params.push(
            search,
            search,
            search,
            search,
            search
        );
    }

    if (query.bloodType) {
        conditions.push("d.blood_type = ?");
        params.push(query.bloodType);
    }

    if (query.reminder === "true") {
        conditions.push("d.wants_reminder = 1");
    }

    if (query.reminder === "false") {
        conditions.push("d.wants_reminder = 0");
    }

    if (query.from || query.to) {
        let donationDateCondition = `
            EXISTS (
                SELECT 1
                FROM donations dn
                WHERE dn.donor_id = d.donor_id
        `;

        if (query.from) {
            donationDateCondition += `
                AND date(dn.donation_date) >= date(?)
            `;

            params.push(query.from);
        }

        if (query.to) {
            donationDateCondition += `
                AND date(dn.donation_date) <= date(?)
            `;

            params.push(query.to);
        }

        donationDateCondition += ")";

        conditions.push(donationDateCondition);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countResult = db.prepare(`
        SELECT COUNT(*) AS total
        FROM donors d
        ${whereClause}
    `).get(...params) as {
        total: number;
    };

    const rows = db.prepare(`
        SELECT
            d.donor_id,
            d.first_name,
            d.last_name,
            d.blood_type,
            d.phone,
            d.wants_reminder,

            (
                SELECT MAX(dn.donation_date)
                FROM donations dn
                WHERE dn.donor_id = d.donor_id
            ) AS last_donation,

            (
                SELECT COUNT(*)
                FROM donations dn
                WHERE dn.donor_id = d.donor_id
            ) AS total_donations

        FROM donors d

        ${whereClause}

        ORDER BY
            last_donation DESC,
            d.donor_id DESC

        LIMIT ? OFFSET ?
    `).all(
        ...params,
        limit,
        offset
    ) as any[];

    const donors = rows.map((donor) => ({
        donor_id: donor.donor_id,
        donor_code: formatDonorId(donor.donor_id),

        first_name: donor.first_name,
        last_name: donor.last_name,
        full_name: `${donor.first_name} ${donor.last_name}`,

        blood_type: donor.blood_type,
        phone: donor.phone,
        wants_reminder: Boolean(donor.wants_reminder),

        last_donation: donor.last_donation,
        total_donations: donor.total_donations,

        days_since_last_donation: getDaysSince(
            donor.last_donation
        ),

        next_eligible: getNextEligibleDate(
            donor.last_donation
        )
    }));

    return {
        donors,
        pagination: {
            page,
            limit,
            total: countResult.total,
            totalPages: Math.ceil(
                countResult.total / limit
            )
        }
    };
}

function getDonorById(id: number) {
    const donor = db.prepare(`
        SELECT *
        FROM donors
        WHERE donor_id = ?
    `).get(id) as any;

    if (!donor) {
        throw new ApiError(404, "Donor not found");
    }

    const donations = db.prepare(`
        SELECT
            donation_id,
            donation_date
        FROM donations
        WHERE donor_id = ?
        ORDER BY donation_date DESC
    `).all(id) as any[];

    const lastDonation = donations.length > 0
        ? donations[0].donation_date
        : null;

    return {
        donor_id: donor.donor_id,
        donor_code: formatDonorId(donor.donor_id),

        first_name: donor.first_name,
        last_name: donor.last_name,
        full_name: `${donor.first_name} ${donor.last_name}`,

        date_of_birth: donor.date_of_birth,
        sex: donor.sex,
        address: donor.address,
        phone: donor.phone,

        blood_type: donor.blood_type,
        wants_reminder: Boolean(donor.wants_reminder),

        created_at: donor.created_at,

        total_donations: donations.length,
        last_donation: lastDonation,

        days_since_last_donation: getDaysSince(
            lastDonation
        ),

        next_eligible: getNextEligibleDate(
            lastDonation
        ),

        donation_history: donations.map((donation) => ({
            donation_id: donation.donation_id,
            donation_code: formatDonationId(
                donation.donation_id
            ),
            donation_date: donation.donation_date
        }))
    };
}

function createDonor(data: DonorInput) {
    const result = db.prepare(`
        INSERT INTO donors (
            first_name,
            last_name,
            date_of_birth,
            sex,
            address,
            phone,
            wants_reminder,
            blood_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        data.first_name.trim(),
        data.last_name.trim(),
        data.date_of_birth,
        data.sex,
        data.address.trim(),
        data.phone.trim(),
        data.wants_reminder ? 1 : 0,
        data.blood_type || null
    );

    return getDonorById(
        Number(result.lastInsertRowid)
    );
}

function updateDonor(
    id: number,
    data: Partial<DonorInput>
) {
    const existing = db.prepare(`
        SELECT donor_id
        FROM donors
        WHERE donor_id = ?
    `).get(id);

    if (!existing) {
        throw new ApiError(404, "Donor not found");
    }

    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
        "first_name",
        "last_name",
        "date_of_birth",
        "sex",
        "address",
        "phone",
        "blood_type"
    ] as const;

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);

            const value = data[field];

            values.push(
                typeof value === "string"
                    ? value.trim()
                    : value
            );
        }
    }

    if (data.wants_reminder !== undefined) {
        fields.push("wants_reminder = ?");
        values.push(data.wants_reminder ? 1 : 0);
    }

    if (fields.length > 0) {
        values.push(id);

        db.prepare(`
            UPDATE donors
            SET ${fields.join(", ")}
            WHERE donor_id = ?
        `).run(...values);
    }

    return getDonorById(id);
}

export default {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonor
};
