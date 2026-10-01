import jwt from "jsonwebtoken";
import { getModelByRole } from "../../utilis/getModelByRole.js";
import { College } from "../../Schema/CollegeSchema.js"; // Ensures College model is registered

export const protectedRoute = async (req, res, next) => {
  try {
    const tokenDetail = req.cookies.token;

    if (!tokenDetail) {
      return res.status(401).json({ success: false, error: "Not authorized, please login" });
    }

    const secret = process.env.JWT_SECRET || "vasu";
    const decoded = jwt.verify(tokenDetail, secret);
    if (!decoded || !decoded._id || !decoded.role) {
      return res.status(401).json({ success: false, error: "Invalid token structure" });
    }

    const Model = getModelByRole(decoded.role);
    let query = Model.findById(decoded._id).select("-password");

    // Only populate college if the role schema actually has a college field
    if (decoded.role !== "admin") {
      query = query.populate("college");
    }

    const account = await query;
    if (!account) {
      return res.status(401).json({ success: false, error: "User account not found" });
    }

    req.user = account;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const checkToken = (req, res, next) => {
  // Allow login and signin requests to proceed and establish or refresh session
  next();
};

export const checkAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
};

export const checkMember = async (req, res, next) => {
  if (req.user && (req.user.role === "member" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ success: false, error: "Member access required" });
  }
};

export const checkUser = async (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return res.status(403).json({ success: false, error: "Student access required" });
  }
};