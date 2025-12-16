import express from "express";
import { auth } from "../Middleware/auth.js";
import { ROLES } from "../config/constants.js";
import User from "../modules/User.js";

const router = express.Router();

// Nearby eligible donors
router.get("/nearby-donors", auth(), async (req, res) => {
  try {
    const { lat, lng, km = 10, group } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }
    const query = {
      Role: { $in: ["donor", ROLES.DONOR] },
      eligible: { $ne: false },
      locationGeo: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(km) * 1000,
        },
      },
    };
    if (group) query.bloodGroup = group;
    const donors = await User.find(query)
      .limit(50)
      .select("Name Email bloodGroup locationGeo lastDonationDate")
      .lean();
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Nearby organizations
router.get("/nearby-organizations", auth(), async (req, res) => {
  try {
    const { lat, lng, km = 20 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }
    const orgs = await User.find({
      Role: { $in: ["hospital", "bloodbank", ROLES.ORGANIZATION] },
      locationGeo: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(km) * 1000,
        },
      },
    })
      .limit(50)
      .select("Name Email organizationName organizationType locationGeo")
      .lean();
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user location
router.post(
  "/location-update",
  auth([ROLES.DONOR, ROLES.ORGANIZATION]),
  async (req, res) => {
    try {
      const { lat, lng } = req.body;
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({ message: "lat and lng are required" });
      }
      const updated = await User.findByIdAndUpdate(
        req.user.userId,
        { locationGeo: { type: "Point", coordinates: [Number(lng), Number(lat)] } },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;

