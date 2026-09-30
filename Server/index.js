import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDb } from './utilis/connetDb.js';
import router from "./Routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Connect to DB with error catching
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

// 1. Explicitly intercept ALL OPTIONS requests first before any routing
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    const cleanOrigin = origin.trim().replace(/\/$/, "");
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/recruitx-client.*\.vercel\.app$/.test(cleanOrigin);

    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin"
      );
      res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
    }
  }

  // Preflight ends here
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// 2. Body parsing and cookies
app.use(express.json());
app.use(cookieParser());

// 3. Health check
app.get('/', (req, res) => {
  res.send("RecruitX API is running");
});

// 4. Logout handler
app.post('/api/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// 5. API routes
app.use('/api', router);

// Error handler to guarantee JSON and CORS headers on runtime failure
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`RecruitX server listening on port ${port}`);
});