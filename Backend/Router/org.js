import express from "express";
import { auth } from "../Middleware/auth.js";
import { ROLES, REQUEST_STATUS, ORG_TYPES } from "../config/constants.js";
import { requireOrgType, canManageInventory, canCreateRequests, canViewIncoming } from "../Middleware/orgAuth.js";
import BloodUnit from "../modules/BloodUnit.js";
import Request from "../modules/Request.js";
import User from "../modules/User.js";
import Appointment from "../modules/Appointment.js";
import Camp from "../modules/Camp.js";

const router = express.Router();

// ============ DASHBOARD HOME ============
// Comprehensive dashboard with role-based stats
router.get("/dashboard", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const orgId = req.user.userId;
    const org = await User.findById(orgId).select("Name organizationType organizationName Email City").lean();

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const orgType = org.organizationType;
    const response = {
      organization: org,
      stats: {},
      myRequests: null,
      incomingRequests: null,
      todayAppointments: null,
      inventoryAlerts: null
    };

    // Stats for all orgs
    const [openRequests, upcomingAppts] = await Promise.all([
      Request.countDocuments({ createdBy: orgId, status: REQUEST_STATUS.OPEN }),
      Appointment.countDocuments({
        organizationId: orgId,
        status: "UPCOMING",
        dateTime: { $gte: new Date() }
      })
    ]);

    response.stats.openRequests = openRequests;
    response.stats.upcomingAppts = upcomingAppts;

    // Inventory stats (for blood banks only)
    if (orgType === ORG_TYPES.BLOOD_BANK || orgType === ORG_TYPES.BOTH) {
      const [availableUnits, expiringSoon] = await Promise.all([
        BloodUnit.countDocuments({ organizationId: orgId, status: "AVAILABLE" }),
        BloodUnit.countDocuments({
          organizationId: orgId,
          status: "AVAILABLE",
          expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), $gte: new Date() }
        })
      ]);

      response.stats.availableUnits = availableUnits;
      response.stats.expiringSoon = expiringSoon;

      // Inventory by blood group
      const inventoryByGroup = await BloodUnit.aggregate([
        { $match: { organizationId: orgId, status: "AVAILABLE" } },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      response.stats.inventoryByGroup = inventoryByGroup;

      // Inventory alerts (expiring soon items)
      const expiringItems = await BloodUnit.find({
        organizationId: orgId,
        status: "AVAILABLE",
        expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), $gte: new Date() }
      })
        .sort({ expiryDate: 1 })
        .limit(5)
        .select("bloodGroup component expiryDate barcode")
        .lean();

      response.inventoryAlerts = expiringItems;
    }

    // My Requests (for hospitals)
    if (orgType === ORG_TYPES.HOSPITAL || orgType === ORG_TYPES.BOTH) {
      const myRequests = await Request.find({
        createdBy: orgId,
        status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] }
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      response.myRequests = myRequests;
    }

    // Incoming Requests (for blood banks)
    if (orgType === ORG_TYPES.BLOOD_BANK || orgType === ORG_TYPES.BOTH) {
      // Get blood groups available in inventory
      const availableGroups = await BloodUnit.distinct("bloodGroup", {
        organizationId: orgId,
        status: "AVAILABLE"
      });

      const incomingRequests = await Request.find({
        status: REQUEST_STATUS.OPEN,
        bloodGroup: { $in: availableGroups },
        createdBy: { $ne: orgId } // Not my own requests
      })
        .sort({ urgency: -1, createdAt: -1 })
        .limit(5)
        .populate("createdBy", "Name organizationName City")
        .lean();

      response.incomingRequests = incomingRequests;
    }

    // Today's Appointments (all orgs)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      organizationId: orgId,
      dateTime: { $gte: today, $lt: tomorrow },
      status: "UPCOMING"
    })
      .populate("donorId", "Name bloodGroup Email")
      .sort({ dateTime: 1 })
      .lean();

    response.todayAppointments = todayAppointments;

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============ BLOOD BANK FEATURES ============
// Reserve matching blood units for an incoming request
router.post("/requests/:id/reserve", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).lean();
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Find AVAILABLE units in this org matching blood group, soonest expiry first
    const units = await BloodUnit.find({
      organizationId: req.user.userId,
      status: "AVAILABLE",
      bloodGroup: request.bloodGroup,
    })
      .sort({ expiryDate: 1 })
      .limit(request.units)
      .select("_id")
      .lean();

    if (!units.length) {
      return res.status(200).json({ reserved: 0, message: "No available units to reserve" });
    }

    await BloodUnit.updateMany(
      { _id: { $in: units.map((u) => u._id) } },
      { $set: { status: "RESERVED" } }
    );

    res.json({ reserved: units.length, message: "Units reserved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark that this org cannot help for an incoming request (no DB state change)
router.post("/requests/:id/cannot-help", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).lean();
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Noted. No units reserved for this request." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============ INVENTORY MANAGEMENT ============
// Inventory list (Blood Banks only)
router.get("/inventory", auth([ROLES.ORGANIZATION]), canManageInventory, async (req, res) => {
  try {
    const items = await BloodUnit.find({ organizationId: req.user.userId })
      .sort({ expiryDate: 1 })
      .lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add inventory (Blood Banks only)
router.post("/inventory", auth([ROLES.ORGANIZATION]), canManageInventory, async (req, res) => {
  try {
    const { group, component, collectionDate, expiryDate, barcode } = req.body;
    if (!group || !collectionDate || !expiryDate) {
      return res.status(400).json({ message: "group, collectionDate, expiryDate are required" });
    }
    const unit = await BloodUnit.create({
      organizationId: req.user.userId,
      bloodGroup: group,
      component,
      collectionDate,
      expiryDate,
      barcode,
    });
    res.status(201).json(unit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Expiring inventory within 7 days (Blood Banks only)
router.get("/inventory/expiring", auth([ROLES.ORGANIZATION]), canManageInventory, async (req, res) => {
  try {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() + 7);
    const items = await BloodUnit.find({
      organizationId: req.user.userId,
      status: "AVAILABLE",
      expiryDate: { $lte: cutoff, $gte: now },
    })
      .sort({ expiryDate: 1 })
      .lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============ REQUEST MANAGEMENT ============
// Incoming requests matching inventory (Blood Banks only)
router.get("/requests/incoming", auth([ROLES.ORGANIZATION]), canViewIncoming, async (req, res) => {
  try {
    // collect distinct blood groups available
    const groups = await BloodUnit.distinct("bloodGroup", {
      organizationId: req.user.userId,
      status: "AVAILABLE",
    });
    const requests = await Request.find({
      bloodGroup: { $in: groups },
      status: REQUEST_STATUS.OPEN,
      createdBy: { $ne: req.user.userId } // Don't show own requests
    })
      .populate("createdBy", "Name organizationName City Email")
      .sort({ urgency: -1, createdAt: -1 })
      .limit(50)
      .lean();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create request (Hospitals only)
router.post("/requests", auth([ROLES.ORGANIZATION]), canCreateRequests, async (req, res) => {
  try {
    const { group, units, urgency, lat, lng, caseId, notes, component } = req.body;
    if (!group || !units || !lat || !lng) {
      return res
        .status(400)
        .json({ message: "group, units, lat, lng are required to create a request" });
    }
    const doc = await Request.create({
      createdBy: req.user.userId,
      bloodGroup: group,
      units,
      urgency,
      component,
      locationGeo: { type: "Point", coordinates: [Number(lng), Number(lat)] },
      caseId,
      notes,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Organization's own requests (Hospitals only)
router.get("/requests", auth([ROLES.ORGANIZATION]), canCreateRequests, async (req, res) => {
  try {
    const list = await Request.find({ createdBy: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update request status
router.put("/requests/:id/status", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const allowed = [REQUEST_STATUS.FULFILLED, REQUEST_STATUS.CANCELLED, REQUEST_STATUS.ASSIGNED];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }
    const updated = await Request.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      { status, fulfilledAt: status === REQUEST_STATUS.FULFILLED ? new Date() : undefined },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark request fulfilled with optional blood units tracking
router.put("/requests/:id/fulfill", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { id } = req.params;
    const { unitsReceived, bloodUnitIds = [], notes } = req.body;

    const request = await Request.findOne({ _id: id, createdBy: req.user.userId });
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = REQUEST_STATUS.FULFILLED;
    request.fulfilledAt = new Date();
    if (notes) request.notes = notes;
    await request.save();

    // If specific blood units are provided, mark them as ISSUED
    if (Array.isArray(bloodUnitIds) && bloodUnitIds.length > 0) {
      await BloodUnit.updateMany(
        { _id: { $in: bloodUnitIds }, organizationId: req.user.userId },
        { $set: { status: "ISSUED" } }
      );
    }

    res.json({
      message: "Request fulfilled",
      request,
      unitsReceived: unitsReceived || request.units,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get matches (nearby donors and orgs) - simple geo query for donors
router.get("/requests/:id/matches", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).lean();
    if (!request) return res.status(404).json({ message: "Request not found" });
    const { coordinates } = request.locationGeo || {};
    if (!coordinates) return res.status(400).json({ message: "Request has no location" });

    const donors = await User.find({
      Role: { $in: ["donor", ROLES.DONOR] },
      bloodGroup: request.bloodGroup,
      locationGeo: {
        $near: {
          $geometry: { type: "Point", coordinates },
          $maxDistance: 10000,
        },
      },
    })
      .limit(50)
      .select("Name Email bloodGroup locationGeo lastDonationDate")
      .lean();

    res.json({ donors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Assign donor to request
router.post("/requests/:id/assign-donor", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { donorId } = req.body;
    if (!donorId) return res.status(400).json({ message: "donorId is required" });
    const { id } = req.params;
    const request = await Request.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      { assignedTo: donorId, status: REQUEST_STATUS.ASSIGNED },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Camps
router.post("/camps", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { title, date, lat, lng, address, capacity } = req.body;
    if (!title || !date || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "title, date, lat, lng are required" });
    }
    const camp = await Camp.create({
      organizationId: req.user.userId,
      title,
      date,
      location: {
        coordinates: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        address,
      },
      capacity,
    });
    res.status(201).json(camp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Stats (simplified)
router.get("/stats", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const orgId = req.user.userId;
    const [availableUnits, expiringSoon, openRequests, upcomingAppts] = await Promise.all([
      BloodUnit.countDocuments({ organizationId: orgId, status: "AVAILABLE" }),
      BloodUnit.countDocuments({
        organizationId: orgId,
        expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      }),
      Request.countDocuments({ createdBy: orgId, status: REQUEST_STATUS.OPEN }),
      Appointment.countDocuments({ organizationId: orgId, status: "UPCOMING" }),
    ]);
    res.json({ availableUnits, expiringSoon, openRequests, upcomingAppts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Camps
router.get("/camps", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const list = await Camp.find({ organizationId: req.user.userId }).sort({ date: 1 }).lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Appointments
router.get("/appointments", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const list = await Appointment.find({ organizationId: req.user.userId })
      .populate("donorId", "Name Email bloodGroup")
      .sort({ dateTime: 1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete appointment (Donor donated)
router.put("/appointments/:id/complete", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const { id } = req.params;
    const { donationSuccessful, unitsCollected, notes, bloodGroup, barcode, expiryDate } = req.body;

    const appointment = await Appointment.findOne({
      _id: id,
      organizationId: req.user.userId,
    }).populate("donorId");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status === "COMPLETED") {
      return res.status(400).json({ message: "Appointment already completed" });
    }

    appointment.status = "COMPLETED";
    appointment.donationSuccessful = donationSuccessful;
    appointment.unitsCollected = unitsCollected || 0;
    appointment.notes = notes;
    await appointment.save();

    if (donationSuccessful) {
      // 1. Update Donor lastDonationDate
      await User.findByIdAndUpdate(appointment.donorId._id, {
        lastDonationDate: new Date(),
      });

      // 2. Add to Inventory (if unit details provided)
      if (unitsCollected > 0 && bloodGroup && barcode && expiryDate) {
        // Create a blood unit for each collected unit (usually 1 per appointment)
        // For simplicity, we assume 1 unit per appointment for now unless loop needed
        await BloodUnit.create({
          organizationId: req.user.userId,
          bloodGroup: bloodGroup,
          component: "Whole Blood", // Default or pass from body
          collectionDate: new Date(),
          expiryDate: expiryDate,
          barcode: barcode,
          status: "AVAILABLE"
        });
      }
    }

    res.json({ message: "Appointment completed", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============ ANALYTICS ============
router.get("/analytics", auth([ROLES.ORGANIZATION]), async (req, res) => {
  try {
    const orgId = req.user.userId;
    const org = await User.findById(orgId).select("organizationType").lean();
    const orgType = org?.organizationType;

    const analytics = {
      requestStats: null,
      inventoryStats: null,
      appointmentStats: null,
      trends: null
    };

    // Request statistics (for hospitals)
    if (orgType === ORG_TYPES.HOSPITAL || orgType === ORG_TYPES.BOTH) {
      const [totalRequests, fulfilledRequests, cancelledRequests] = await Promise.all([
        Request.countDocuments({ createdBy: orgId }),
        Request.countDocuments({ createdBy: orgId, status: REQUEST_STATUS.FULFILLED }),
        Request.countDocuments({ createdBy: orgId, status: REQUEST_STATUS.CANCELLED })
      ]);

      const fulfillmentRate = totalRequests > 0 ? (fulfilledRequests / totalRequests * 100).toFixed(1) : 0;

      analytics.requestStats = {
        total: totalRequests,
        fulfilled: fulfilledRequests,
        cancelled: cancelledRequests,
        open: totalRequests - fulfilledRequests - cancelledRequests,
        fulfillmentRate
      };

      // Request by urgency
      const requestsByUrgency = await Request.aggregate([
        { $match: { createdBy: orgId } },
        { $group: { _id: "$urgency", count: { $sum: 1 } } }
      ]);
      analytics.requestStats.byUrgency = requestsByUrgency;
    }

    // Inventory statistics (for blood banks)
    if (orgType === ORG_TYPES.BLOOD_BANK || orgType === ORG_TYPES.BOTH) {
      const inventoryByStatus = await BloodUnit.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);

      const inventoryByGroup = await BloodUnit.aggregate([
        { $match: { organizationId: orgId, status: "AVAILABLE" } },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      analytics.inventoryStats = {
        byStatus: inventoryByStatus,
        byGroup: inventoryByGroup
      };
    }

    // Appointment statistics (all orgs)
    const [totalAppts, completedAppts, upcomingAppts] = await Promise.all([
      Appointment.countDocuments({ organizationId: orgId }),
      Appointment.countDocuments({ organizationId: orgId, status: "COMPLETED" }),
      Appointment.countDocuments({ organizationId: orgId, status: "UPCOMING" })
    ]);

    analytics.appointmentStats = {
      total: totalAppts,
      completed: completedAppts,
      upcoming: upcomingAppts
    };

    res.json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

