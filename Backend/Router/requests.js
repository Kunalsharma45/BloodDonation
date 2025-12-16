import express from "express";
import Request from "../modules/Request.js";
import User from "../modules/User.js";
import { authMiddleware } from "../Middleware/auth.js";
import { donorAuth } from "../Middleware/donorAuth.js";
import { orgAuth } from "../Middleware/orgAuth.js";
import { adminAuth } from "../Middleware/adminAuth.js";
import { REQUEST_STATUS, URGENCY } from "../config/constants.js";

const router = express.Router();

// ==================== DONOR ENDPOINTS ====================

/**
 * GET /api/requests/nearby
 * Get nearby blood requests for a donor based on location and compatibility
 */
router.get("/nearby", donorAuth, async (req, res) => {
    try {
        const { lat, lng, km = 10, urgency, bloodGroup } = req.query;
        const donor = await User.findById(req.user.userId);

        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        // Build query
        const query = {
            status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] },
            bloodGroup: donor.bloodGroup || bloodGroup // Match donor's blood group
        };

        // Add urgency filter if specified
        if (urgency && urgency !== "ALL") {
            query.urgency = urgency;
        }

        // Location-based search
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const kmNum = parseFloat(km);

        let requests;
        if (latNum && lngNum) {
            requests = await Request.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [lngNum, latNum] },
                        distanceField: "distance",
                        maxDistance: kmNum * 1000, // Convert km to meters
                        spherical: true,
                        query: query
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "organizationId",
                        foreignField: "_id",
                        as: "organization"
                    }
                },
                {
                    $unwind: { path: "$organization", preserveNullAndEmptyArrays: true }
                },
                {
                    $addFields: {
                        hospitalName: "$organization.organizationName",
                        distance: { $divide: ["$distance", 1000] }, // Convert to km
                        hasExpressedInterest: { $in: [donor._id, "$interestedDonors"] },
                        interestedDonorsCount: { $size: { $ifNull: ["$interestedDonors", []] } }
                    }
                },
                {
                    $project: {
                        organization: 0
                    }
                },
                {
                    $sort: { distance: 1, urgency: -1, createdAt: -1 }
                },
                {
                    $limit: 50
                }
            ]);
        } else {
            // Fallback without geospatial
            requests = await Request.find(query)
                .populate("organizationId", "organizationName location")
                .sort({ urgency: -1, createdAt: -1 })
                .limit(20)
                .lean();

            requests = requests.map(req => ({
                ...req,
                hospitalName: req.organizationId?.organizationName,
                hasExpressedInterest: req.interestedDonors?.includes(donor._id),
                interestedDonorsCount: req.interestedDonors?.length || 0
            }));
        }

        // Check donor eligibility
        const lastDonation = donor.lastDonationDate;
        const nextEligible = donor.nextEligibleDate;
        const isEligible = !nextEligible || new Date(nextEligible) <= new Date();

        res.json({
            requests,
            eligible: isEligible,
            nextEligibleDate: nextEligible
        });
    } catch (error) {
        console.error("Error fetching nearby requests:", error);
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
});

/**
 * GET /api/requests/:id
 * Get single request details
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("organizationId", "organizationName location phone email")
            .populate("interestedDonors", "name phone bloodGroup")
            .lean();

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Add computed fields
        request.hospitalName = request.organizationId?.organizationName;
        request.interestedDonorsCount = request.interestedDonors?.length || 0;

        // Check if current user has expressed interest
        if (req.user.role === "DONOR") {
            request.hasExpressedInterest = request.interestedDonors?.some(
                d => d._id.toString() === req.user.userId
            );
        }

        res.json(request);
    } catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ message: "Failed to fetch request" });
    }
});

/**
 * POST /api/requests/:id/interest
 * Donor expresses interest in a request
 */
router.post("/:id/interest", donorAuth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== REQUEST_STATUS.OPEN && request.status !== REQUEST_STATUS.ASSIGNED) {
            return res.status(400).json({ message: "This request is no longer active" });
        }

        // Check if already interested
        if (request.interestedDonors.includes(req.user.userId)) {
            return res.status(400).json({ message: "You have already expressed interest" });
        }

        // Add donor to interested list
        request.interestedDonors.push(req.user.userId);
        await request.save();

        // TODO: Send notification to hospital

        res.json({
            message: "Interest recorded successfully",
            request: {
                _id: request._id,
                interestedDonorsCount: request.interestedDonors.length
            }
        });
    } catch (error) {
        console.error("Error expressing interest:", error);
        res.status(500).json({ message: "Failed to express interest" });
    }
});

/**
 * DELETE /api/requests/:id/interest
 * Donor withdraws interest
 */
router.delete("/:id/interest", donorAuth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.interestedDonors = request.interestedDonors.filter(
            id => id.toString() !== req.user.userId
        );
        await request.save();

        res.json({ message: "Interest withdrawn successfully" });
    } catch (error) {
        console.error("Error withdrawing interest:", error);
        res.status(500).json({ message: "Failed to withdraw interest" });
    }
});

/**
 * GET /api/requests/donor/history
 * Get donor's request history
 */
router.get("/donor/history", donorAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const requests = await Request.find({
            interestedDonors: req.user.userId
        })
            .populate("organizationId", "organizationName location")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        const total = await Request.countDocuments({
            interestedDonors: req.user.userId
        });

        res.json({
            requests,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching donor history:", error);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

// ==================== ORGANIZATION (HOSPITAL) ENDPOINTS ====================

/**
 * POST /api/org/requests
 * Create a new blood request (Hospital)
 */
router.post("/org", orgAuth, async (req, res) => {
    try {
        const {
            bloodGroup,
            component,
            unitsNeeded,
            urgency,
            contactPerson,
            contactPhone,
            caseDetails,
            patientAge,
            patientGender,
            requiredBy
        } = req.body;

        // Get organization info for location
        const org = await User.findById(req.user.userId);
        if (!org) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Create request
        const request = new Request({
            organizationId: req.user.userId,
            bloodGroup,
            component: component || "WHOLE_BLOOD",
            unitsNeeded,
            urgency: urgency || "MEDIUM",
            location: {
                type: "Point",
                coordinates: org.location?.coordinates || [0, 0],
                address: org.address,
                city: org.city,
                state: org.state
            },
            contactPerson,
            contactPhone,
            caseDetails,
            patientAge,
            patientGender,
            requiredBy,
            status: REQUEST_STATUS.OPEN
        });

        await request.save();

        // TODO: Broadcast to nearby compatible donors and blood banks

        res.status(201).json({
            message: "Blood request created successfully",
            request
        });
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ message: "Failed to create request", error: error.message });
    }
});

/**
 * GET /api/org/requests/mine
 * Get organization's own requests
 */
router.get("/org/mine", orgAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, urgency } = req.query;

        const query = { organizationId: req.user.userId };
        if (status) query.status = status;
        if (urgency) query.urgency = urgency;

        const requests = await Request.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Add computed fields
        const enrichedRequests = requests.map(req => ({
            ...req,
            interestedDonorsCount: req.interestedDonors?.length || 0,
            availableBanksCount: 0 // TODO: Calculate from blood banks
        }));

        const total = await Request.countDocuments(query);

        res.json({
            requests: enrichedRequests,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Failed to fetch requests" });
    }
});

/**
 * GET /api/org/requests/:id/matches
 * Get matching donors and blood banks for a request
 */
router.get("/org/:id/matches", orgAuth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.organizationId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get interested donors with details
        const donors = await User.find({
            _id: { $in: request.interestedDonors },
            role: "DONOR"
        })
            .select("name phone bloodGroup location lastDonationDate nextEligibleDate")
            .lean();

        // Add distance and eligibility (simplified)
        const enrichedDonors = donors.map(donor => ({
            ...donor,
            distance: 5, // TODO: Calculate actual distance
            isEligible: !donor.nextEligibleDate || new Date(donor.nextEligibleDate) <= new Date(),
            interestedAt: request.createdAt // Approximation
        }));

        // TODO: Find compatible blood banks with stock
        const bloodBanks = [];

        res.json({
            donors: enrichedDonors,
            bloodBanks
        });
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: "Failed to fetch matches" });
    }
});

/**
 * PUT /api/org/requests/:id/assign
 * Assign a donor or blood bank to a request
 */
router.put("/org/:id/assign", orgAuth, async (req, res) => {
    try {
        const { type, donorId, organizationId } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.organizationId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (request.status !== REQUEST_STATUS.OPEN) {
            return res.status(400).json({ message: "Request is not in OPEN status" });
        }

        // Update assignment
        request.assignedTo = {
            type,
            donorId: type === "DONOR" ? donorId : undefined,
            organizationId: type === "BLOOD_BANK" ? organizationId : undefined
        };
        request.status = REQUEST_STATUS.ASSIGNED;

        await request.save();

        // TODO: Create appointment if donor
        // TODO: Notify assigned party

        res.json({
            message: `${type} assigned successfully`,
            request
        });
    } catch (error) {
        console.error("Error assigning request:", error);
        res.status(500).json({ message: "Failed to assign request" });
    }
});

/**
 * PUT /api/org/requests/:id/fulfill
 * Mark request as fulfilled
 */
router.put("/org/:id/fulfill", orgAuth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.organizationId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        request.status = REQUEST_STATUS.FULFILLED;
        request.fulfilledAt = new Date();

        await request.save();

        res.json({
            message: "Request marked as fulfilled",
            request
        });
    } catch (error) {
        console.error("Error fulfilling request:", error);
        res.status(500).json({ message: "Failed to fulfill request" });
    }
});

/**
 * PUT /api/org/requests/:id/cancel
 * Cancel a request
 */
router.put("/org/:id/cancel", orgAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.organizationId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        request.status = REQUEST_STATUS.CANCELLED;
        request.notes = reason || request.notes;

        await request.save();

        res.json({
            message: "Request cancelled successfully",
            request
        });
    } catch (error) {
        console.error("Error cancelling request:", error);
        res.status(500).json({ message: "Failed to cancel request" });
    }
});

/**
 * GET /api/org/requests/incoming
 * Get incoming requests for blood banks
 */
router.get("/org/incoming", orgAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, bloodGroup, urgency } = req.query;

        // Get organization
        const org = await User.findById(req.user.userId);
        if (!org || !["BANK", "BOTH"].includes(org.organizationType)) {
            return res.status(403).json({ message: "Only blood banks can access this" });
        }

        // Build query for open requests
        const query = {
            status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] },
            organizationId: { $ne: req.user.userId } // Exclude own requests
        };

        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (urgency) query.urgency = urgency;

        // TODO: Filter by blood bank's available inventory
        // TODO: Add geospatial filtering

        const requests = await Request.find(query)
            .populate("organizationId", "organizationName location phone")
            .sort({ urgency: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Add computed fields
        const enrichedRequests = requests.map(req => ({
            ...req,
            hospitalName: req.organizationId?.organizationName,
            distance: 10, // TODO: Calculate actual distance
            canFulfill: true, // TODO: Check actual stock
            availableUnits: 5 // TODO: Get from inventory
        }));

        const total = await Request.countDocuments(query);

        res.json({
            requests: enrichedRequests,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error("Error fetching incoming requests:", error);
        res.status(500).json({ message: "Failed to fetch incoming requests" });
    }
});

// ==================== ADMIN ENDPOINTS ====================

/**
 * GET /api/admin/requests
 * Get all requests with filters (Admin)
 */
router.get("/admin/all", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, urgency, city, organizationId } = req.query;

        const query = {};
        if (status) query.status = status;
        if (urgency) query.urgency = urgency;
        if (city) query["location.city"] = new RegExp(city, "i");
        if (organizationId) query.organizationId = organizationId;

        const requests = await Request.find(query)
            .populate("organizationId", "organizationName location city")
            .populate("assignedTo.donorId", "name phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Add computed fields
        const enrichedRequests = requests.map(req => ({
            ...req,
            hospitalName: req.organizationId?.organizationName,
            interestedDonorsCount: req.interestedDonors?.length || 0,
            availableBanksCount: 0 // TODO: Calculate
        }));

        const total = await Request.countDocuments(query);

        res.json({
            requests: enrichedRequests,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error("Error fetching all requests:", error);
        res.status(500).json({ message: "Failed to fetch requests" });
    }
});

/**
 * GET /api/admin/requests/summary
 * Get request statistics (Admin)
 */
router.get("/admin/summary", adminAuth, async (req, res) => {
    try {
        const total = await Request.countDocuments();
        const fulfilled = await Request.countDocuments({ status: REQUEST_STATUS.FULFILLED });
        const active = await Request.countDocuments({
            status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] }
        });
        const critical = await Request.countDocuments({
            urgency: "CRITICAL",
            status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] }
        });

        // Calculate average response time
        const fulfilledRequests = await Request.find({
            status: REQUEST_STATUS.FULFILLED,
            fulfilledAt: { $exists: true }
        })
            .select("createdAt fulfilledAt")
            .limit(100)
            .lean();

        let avgResponseTime = "0h";
        if (fulfilledRequests.length > 0) {
            const totalTime = fulfilledRequests.reduce((sum, req) => {
                return sum + (new Date(req.fulfilledAt) - new Date(req.createdAt));
            }, 0);
            const avgMs = totalTime / fulfilledRequests.length;
            const hours = Math.round(avgMs / (1000 * 60 * 60));
            avgResponseTime = `${hours}h`;
        }

        res.json({
            total,
            fulfilled,
            active,
            critical,
            avgResponseTime,
            successRate: total > 0 ? ((fulfilled / total) * 100).toFixed(1) : 0
        });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: "Failed to fetch summary" });
    }
});

/**
 * GET /api/admin/requests/alerts
 * Get unfulfilled/overdue alerts (Admin)
 */
router.get("/admin/alerts", adminAuth, async (req, res) => {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const overdueRequests = await Request.find({
            status: { $in: [REQUEST_STATUS.OPEN, REQUEST_STATUS.ASSIGNED] },
            urgency: { $in: ["CRITICAL", "HIGH"] },
            createdAt: { $lt: twoHoursAgo }
        })
            .populate("organizationId", "organizationName city")
            .sort({ urgency: -1, createdAt: 1 })
            .limit(50)
            .lean();

        const alerts = overdueRequests.map(req => ({
            requestId: req._id,
            bloodGroup: req.bloodGroup,
            unitsNeeded: req.unitsNeeded,
            urgency: req.urgency,
            hospitalName: req.organizationId?.organizationName,
            city: req.organizationId?.city,
            createdAt: req.createdAt,
            hoursOpen: Math.round((Date.now() - new Date(req.createdAt)) / (1000 * 60 * 60))
        }));

        res.json({
            count: alerts.length,
            alerts
        });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({ message: "Failed to fetch alerts" });
    }
});

/**
 * POST /api/admin/notifications/broadcast
 * Broadcast notification to compatible donors (Admin)
 */
router.post("/admin/broadcast", adminAuth, async (req, res) => {
    try {
        const { requestId, message } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // TODO: Find compatible donors in area
        // TODO: Send push notifications
        // TODO: Send SMS/email alerts

        res.json({
            message: "Broadcast sent successfully",
            recipientCount: 0 // TODO: Actual count
        });
    } catch (error) {
        console.error("Error broadcasting:", error);
        res.status(500).json({ message: "Failed to send broadcast" });
    }
});

export default router;
