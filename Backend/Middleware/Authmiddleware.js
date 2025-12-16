import jwt from "jsonwebtoken"

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, "kunal@123");
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Access denied: Not allowed" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};
