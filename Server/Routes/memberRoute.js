import express from "express";
import { protectedRoute, checkMember } from "../middleware/Auth/index.js";
import {
  displayAllSociety,
  displaySociety,
  getMySociety,
  createSociety,
  addDepartment,
  removeDepartment,
  changeStatus,
} from "../Controllers/SocietyControllers.js";

const router = express.Router();

router.get("/displayallsociety", protectedRoute, displayAllSociety);
router.get("/displaysociety/:SocietyId", protectedRoute, displaySociety);
router.get("/mysociety", protectedRoute, checkMember, getMySociety);

router.post("/createsociety", protectedRoute, checkMember, createSociety);
router.patch("/adddepartment", protectedRoute, checkMember, addDepartment);
router.delete("/removedepartment", protectedRoute, checkMember, removeDepartment);

router.patch("/changestatus", protectedRoute, checkMember, changeStatus);
router.post("/changestatus", protectedRoute, checkMember, changeStatus);

export default router; 