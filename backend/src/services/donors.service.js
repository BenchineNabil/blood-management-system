
import db from "../config/db";
import { formatDonorId, formatDonationId } from "../utils/ids";

function createError(message: string, statusCode: number) {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
}

function formatDonor(donor: any) {
  if (!donor) return null;

  return {
    ...donor,
    donorNumber: formatDonorId(donor.donor_id),
    wants_reminder: Boolean(donor.wants_reminder)
  };
}

function getDonorRow(donorNumber: number) {
  return db.prepare(`
    SELECT *
    FROM donors
    WHERE donor_id = ?
  `).get(donorNumber) as any;
}

export function getAllDonors(options: {
  search: string;
  bloodType?: string;
  page: number;
  limit: number;
}) {
  const search = options.search.trim();
  const bloodType = options.bloodType;

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (search) {
    conditions.push(`
      (
        first_name LIKE ?
        OR last_name LIKE ?
        OR phone LIKE ?
      )
    `);

    const searchValue = `%${search}%`;

    params.push(searchValue, searchValue, searchValue);
  }

  if (bloodType) {
    conditions.push("blood_type = ?");
    params.push(bloodType);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const totalResult = db.prepare(`
    SELECT COUNT(*) AS total
    FROM donors
    ${whereClause}
  `).get(...params) as { total: number };

  const donors = db.prepare(`
    SELECT
      d.*,
      (
        SELECT MAX(donation_date)
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS last_donation,
      (
        SELECT COUNT(*)
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS total_donations,
      (
        SELECT date(MAX(donation_date), '+56 days')
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS next_eligible_date
    FROM donors d
    ${whereClause}
    ORDER BY d.donor_id DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as any[];

  return {
    data: donors.map(formatDonor),
    pagination: {
      page,
      limit,
      total: totalResult.total,
      totalPages: Math.ceil(totalResult.total / limit)
    }
  };
}

export function getDonorByNumber(donorNumber: number) {
  const donor = db.prepare(`
    SELECT
      d.*,
      (
        SELECT MAX(donation_date)
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS last_donation,
      (
        SELECT COUNT(*)
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS total_donations,
      (
        SELECT date(MAX(donation_date), '+56 days')
        FROM donations
        WHERE donor_id = d.donor_id
      ) AS next_eligible_date
    FROM donors d
    WHERE d.donor_id = ?
  `).get(donorNumber) as any;

  if (!donor) {
    throw createError("Donor not found", 404);
  }

  return formatDonor(donor);
}

export function createDonor(data: any) {
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
    data.first_name,
    data.last_name,
    data.date_of_birth,
    data.sex,
    data.address,
    data.phone,
    data.wants_reminder ? 1 : 0,
    data.blood_type || null
  );

  const donorNumber = Number(result.lastInsertRowid);

  return getDonorByNumber(donorNumber);
}

export function updateDonor(donorNumber: number, data: any) {
  const existingDonor = getDonorRow(donorNumber);

  if (!existingDonor) {
    throw createError("Donor not found", 404);
  }

  db.prepare(`
    UPDATE donors
    SET
      first_name = ?,
      last_name = ?,
      date_of_birth = ?,
      sex = ?,
      address = ?,
      phone = ?,
      wants_reminder = ?,
      blood_type = ?
    WHERE donor_id = ?
  `).run(
    data.first_name,
    data.last_name,
    data.date_of_birth,
    data.sex,
    data.address,
    data.phone,
    data.wants_reminder ? 1 : 0,
    data.blood_type || null,
    donorNumber
  );

  return getDonorByNumber(donorNumber);
}

export function getDonorDonations(donorNumber: number) {
  const donor = getDonorRow(donorNumber);

  if (!donor) {
    throw createError("Donor not found", 404);
  }

  const donations = db.prepare(`
    SELECT
      donation_id,
      donor_id,
      donation_date
    FROM donations
    WHERE donor_id = ?
    ORDER BY donation_date DESC
  `).all(donorNumber) as any[];

  return donations.map((donation) => ({
    ...donation,
    donationNumber: formatDonationId(donation.donation_id)
  }));
}
