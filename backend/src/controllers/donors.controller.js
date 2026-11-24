
import { Request, Response, NextFunction } from "express";
import * as donorsService from "../services/donors.service";

function parseDonorNumber(value: string): number {

  const cleaned = value.replace(/^DR-/i, "");
  const donorNumber = Number(cleaned);

  if (!Number.isInteger(donorNumber) || donorNumber <= 0) {
    const error = new Error("Invalid donor number") as any;
    error.statusCode = 400;
    throw error;
  }

  return donorNumber;
}

export function getAllDonors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donors = donorsService.getAllDonors({
      search: String(req.query.search ?? ""),
      bloodType: req.query.bloodType
        ? String(req.query.bloodType)
        : undefined,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10)
    });

    res.status(200).json({
      success: true,
      ...donors
    });
  } catch (error) {
    next(error);
  }
}

export function getDonorByNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorNumber = parseDonorNumber(req.params.donorNumber);

    const donor = donorsService.getDonorByNumber(donorNumber);

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    next(error);
  }
}

export function createDonor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donor = donorsService.createDonor(req.body);

    res.status(201).json({
      success: true,
      message: "Donor registered successfully",
      data: donor
    });
  } catch (error) {
    next(error);
  }
}

export function updateDonor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorNumber = parseDonorNumber(req.params.donorNumber);

    const donor = donorsService.updateDonor(
      donorNumber,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      data: donor
    });
  } catch (error) {
    next(error);
  }
}

export function getDonorDonations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorNumber = parseDonorNumber(req.params.donorNumber);

    const donations = donorsService.getDonorDonations(donorNumber);

    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    next(error);
  }
}
