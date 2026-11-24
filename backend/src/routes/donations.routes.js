import { Router } from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById
} from "../controllers/donations.controller";

const router = Router();

router.get("/", getAllDonations);
router.get("/:id", getDonationById);
router.post("/", createDonation);

export default router;
