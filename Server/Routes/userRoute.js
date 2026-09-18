import express from "express"
import {createuserprofile} from "../Controllers/VerificationControllers.js"
import { protectedRoute } from "../middleware/Auth/index.js"
import { allappliedSociety,enrollSociety,deleteSociety,userDetails } from "../Controllers/userController.js"

const router = express.Router()

router.get('/getuserdetails', protectedRoute, userDetails);
router.get("/allappliedsociety", protectedRoute, allappliedSociety);

router.post("/createuserprofile", protectedRoute, createuserprofile);
router.post("/enrollsociety", protectedRoute, enrollSociety);

router.delete("/deletesociety", protectedRoute, deleteSociety);

export default router;