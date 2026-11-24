import { Request, Response, NextFunction } from "express";
import * as donationsService from "../services/donations.service";

function createRequestError(message: string) {
  const error = new Error(message) as any;
  error.statusCode = 400;
  return error;
}

function parseDonationId(value: string): number {
  const cleaned = value.replace(/^DN-/i, "");

  if (!/^\d+$/.test(cleaned)) {
    throw createRequestError("Invalid donation ID");
  }

  const donationId = Number(cleaned);

  if (!Number.isSafeInteger(donationId) || donationId <= 0) {
    throw createRequestError("Invalid donation ID");
  }

  return donationId;
}

function parseDonorNumber(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") {
    throw createRequestError("A valid donorNumber is required");
  }

  const cleaned = String(value).replace(/^DR-/i, "");

  if (!/^\d+$/.test(cleaned)) {
    throw createRequestError("A valid donorNumber is required");
  }

  const donorNumber = Number(cleaned);

  if (!Number.isSafeInteger(donorNumber) || donorNumber <= 0) {
    throw createRequestError("A valid donorNumber is required");
  }

  return donorNumber;
}

function validateDonationDate(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    throw createRequestError(
      "donation_date must use YYYY-MM-DD format"
    );
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw createRequestError("donation_date must be a valid date");
  }

  return value;
}

function handleError(
  error: any,
  res: Response,
  next: NextFunction
) {
  if (Number.isInteger(error?.statusCode)) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  next(error);
}

export function getAllDonations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donations = donationsService.getAllDonations();

    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    handleError(error, res, next);
  }
}

export function getDonationById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donationId = parseDonationId(req.params.id);
    const donation = donationsService.getDonationById(donationId);

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    handleError(error, res, next);
  }
}

export function createDonation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      throw createRequestError("Request body must be an object");
    }

    const allowedFields = ["donorNumber", "donation_date"];
    const unsupportedFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unsupportedFields.length > 0) {
      throw createRequestError(
        `Unsupported donation field(s): ${unsupportedFields.join(", ")}`
      );
    }

    const donorNumber = parseDonorNumber(req.body?.donorNumber);
    const donationDate = validateDonationDate(req.body?.donation_date);

    const donation = donationsService.createDonation(
      donorNumber,
      donationDate
    );

    res.status(201).json({
      success: true,
      message: "Donation registered successfully",
      data: donation
    });
  } catch (error) {
    handleError(error, res, next);
  }
}
