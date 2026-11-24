import { Router } from "express";
import donationsRoutes from "./donations.routes";
import donorsRoutes from "./donors.routes";

const router = Router();

router.use("/donations", donationsRoutes);
router.use("/donors", donorsRoutes);

export default router;

