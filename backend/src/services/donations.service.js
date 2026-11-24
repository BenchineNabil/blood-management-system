import db from "../config/db";
import { formatDonationId } from "../utils/ids";

function createError(message: string, statusCode: number) {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
}

function formatDonation(donation: any) {
  return {
    ...donation,
    donationNumber: formatDonationId(donation.donation_id)
  };
}

export function getAllDonations() {
  const donations = db.prepare(`
    SELECT
      donation_id,
      donor_id,
      donation_date
    FROM donations
    ORDER BY donation_date DESC, donation_id DESC
  `).all() as any[];

  return donations.map(formatDonation);
}

export function getDonationById(donationId: number) {
  const donation = db.prepare(`
    SELECT
      donation_id,
      donor_id,
      donation_date
    FROM donations
    WHERE donation_id = ?
  `).get(donationId) as any;

  if (!donation) {
    throw createError("Donation not found", 404);
  }

  return formatDonation(donation);
}

export function createDonation(
  donorNumber: number,
  donationDate: string
) {
  const donor = db.prepare(`
    SELECT donor_id
    FROM donors
    WHERE donor_id = ?
  `).get(donorNumber);

  if (!donor) {
    throw createError("Donor not found", 404);
  }

  const result = db.prepare(`
    INSERT INTO donations (
      donor_id,
      donation_date
    )
    VALUES (?, ?)
  `).run(donorNumber, donationDate);

  return getDonationById(Number(result.lastInsertRowid));
}
