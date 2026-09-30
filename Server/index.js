import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDb } from './utilis/connetDb.js';
import router from "./Routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDb().catch((err) => {
  console.error("Database connection failed:", err);
});

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://recruitx-client.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

if (process.env.CLIENT_URL) {
  const envOrigin = process.env.CLIENT_URL.trim().replace(/\/$/, "");
  if (envOrigin && !allowedOrigins.includes(envOrigin)) {
    allowedOrigins.push(envOrigin);
  }
}

// ✅ Standard CORS setup
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, "");
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn("CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Set-Cookie"],
}));

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.send("RecruitX API is running");
});

// Logout
app.post('/api/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// API routes
app.use('/api', router);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`RecruitX server listening on port ${port}`);
});