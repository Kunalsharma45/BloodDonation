// Minimal validation middleware placeholder; extend with Joi/Zod if needed
export const requireFields = (fields = []) => (req, res, next) => {
  const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null);
  if (missing.length) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
  }
  next();
};

