import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ROLES } from "../config/constants.js";

/**
 * Donor Authentication Middleware
 * Verifies JWT token and ensures the user has DONOR role
 */
export const donorAuth = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;

        // Check if user has DONOR role
        if (decoded.role !== ROLES.DONOR) {
            return res.status(403).json({
                message: "Access denied. This endpoint is only for donors."
            });
        }

        return next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

/**
 * General auth middleware (exported as authMiddleware for compatibility)
 */
export const authMiddleware = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};
