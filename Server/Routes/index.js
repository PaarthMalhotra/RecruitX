import express from "express"
import userRoute from "./userRoute.js"
import memberRoute from "./memberRoute.js"
import adminRoute from "./adminRoute.js"
import { checkToken } from "../middleware/Auth/index.js"
import {login,signin} from "../Controllers/VerificationControllers.js"

const router = express.Router()

router.use("/user",userRoute)
router.use("/member",memberRoute)
router.use("/admin",adminRoute)

router.post("/login",checkToken,login)
router.post("/signin",checkToken,signin)

export default router;
