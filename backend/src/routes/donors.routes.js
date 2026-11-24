
import { Router } from "express";
import {
  getAllDonors,
  getDonorByNumber,
  createDonor,
  updateDonor,
  getDonorDonations
} from "../controllers/donors.controller";

import {
  validateCreateDonor,
  validateUpdateDonor
} from "../middlewares/validate";

const router = Router();

router.get("/", getAllDonors);

router.get("/:donorNumber/donations", getDonorDonations);

router.get("/:donorNumber", getDonorByNumber);

router.post("/", validateCreateDonor, createDonor);

router.put("/:donorNumber", validateUpdateDonor, updateDonor);

export default router;
