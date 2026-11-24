import {
    Request,
    Response,
    NextFunction
} from "express";

import donorsService from "../services/donors.service";

function getAllDonors(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = donorsService.getAllDonors(
            req.query as any
        );

        res.status(200).json({
            success: true,
            data: result.donors,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
}

function getDonorById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid donor ID"
            });

            return;
        }

        const donor = donorsService.getDonorById(id);

        res.status(200).json({
            success: true,
            data: donor
        });
    } catch (error) {
        next(error);
    }
}

function createDonor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const donor = donorsService.createDonor(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Donor created successfully",
            data: donor
        });
    } catch (error) {
        next(error);
    }
}

function updateDonor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid donor ID"
            });

            return;
        }

        const donor = donorsService.updateDonor(
            id,
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

export default {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonor
};
