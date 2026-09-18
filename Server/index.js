import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDb } from './utilis/connetDb.js';
import router from "./Routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDb();

const app = express();
const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: clientUrl,
  credentials: true,
}));

app.get('/', (req, res) => {
    res.send("RecruitX API is running");
});

app.post('/api/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`RecruitX server listening on port ${port}`);
});