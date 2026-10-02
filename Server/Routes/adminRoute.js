import express from "express";
import { protectedRoute, checkAdmin } from "../middleware/Auth/index.js";
import {
  displayAllSociety,
  deleteSociety,
  getAdminStats,
  displaySociety,
} from "../Controllers/SocietyControllers.js";
import { createCollege, getColleges } from "../Controllers/CollegeController.js";

const router = express.Router();

router.get("/stats", protectedRoute, checkAdmin, getAdminStats);
router.get("/displayallsociety", protectedRoute, checkAdmin, displayAllSociety);
router.get("/displaysociety/:SocietyId", protectedRoute, checkAdmin, displaySociety);
router.delete("/deletesociety/:_id", protectedRoute, checkAdmin, deleteSociety);
router.delete("/deletesociety", protectedRoute, checkAdmin, deleteSociety);

router.get("/colleges", protectedRoute, checkAdmin, getColleges);
router.post("/colleges", protectedRoute, checkAdmin, createCollege);

export default router;
