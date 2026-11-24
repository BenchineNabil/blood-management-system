import { Router } from "express";
import donorsRoutes from "./donors.routes";

const router = Router();

router.use("/donors", donorsRoutes);

export default router;

