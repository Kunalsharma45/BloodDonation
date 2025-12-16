import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ROLES } from "../config/constants.js";

/**
 * Admin Authentication Middleware
 * Verifies JWT token and ensures the user has ADMIN role
 */
export const adminAuth = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;

        // Check if user has ADMIN role
        if (decoded.role !== ROLES.ADMIN) {
            return res.status(403).json({
                message: "Access denied. This endpoint is only for administrators."
            });
        }

        return next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};
