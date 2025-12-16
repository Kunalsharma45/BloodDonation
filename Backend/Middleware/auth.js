import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = decoded;

      if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ msg: "Access denied: insufficient role" });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

/**
 * General authentication middleware (no role restriction)
 */
export const authMiddleware = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
