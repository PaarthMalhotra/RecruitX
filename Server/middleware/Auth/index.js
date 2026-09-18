import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const tokenDetail = req.cookies.token;

        if (!tokenDetail) {
            return res.status(401).json({ success: false, error: "Not authorized, please login" });
        }

        const secret = process.env.JWT_SECRET || "vasu";
        const decoded = jwt.verify(tokenDetail, secret);
        if (decoded) {
            req.user = { _id: decoded._id, role: decoded.role };
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
};

export const checkToken = (req, res, next) => {
    try {
        if (req.cookies.token) {
            return res.status(403).json({
                success: false,
                error: "Already logged in"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
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