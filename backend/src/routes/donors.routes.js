import { Router } from "express";

import donorsController from "../controllers/donors.controller";

import {
    validateCreateDonor,
    validateUpdateDonor
} from "../middlewares/validate";

import { auth } from "../middlewares/auth";
import { role } from "../middlewares/role";

const router = Router();

router.use(auth);

router.get(
    "/",
    donorsController.getAllDonors
);

router.get(
    "/:id",
    donorsController.getDonorById
);

router.post(
    "/",
    role("admin", "nurse"),
    validateCreateDonor,
    donorsController.createDonor
);

router.patch(
    "/:id",
    role("admin", "nurse"),
    validateUpdateDonor,
    donorsController.updateDonor
);

export default router;
