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

app.set("trust proxy", 1);

// Allowed origins for CORS (production, local dev, and environment variable)
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

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, "");
    if (
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/recruitx-client.*\.vercel\.app$/.test(cleanOrigin)
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};

// 1. CORS middleware must run before body parsers and routes
app.use(cors(corsOptions));

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

// Only listen on port when running locally / standalone, not on Vercel serverless
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`RecruitX server listening on port ${port}`);
  });
}

export default app;