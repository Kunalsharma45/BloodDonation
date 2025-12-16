import express from "express";
import { auth } from "../Middleware/auth.js";
import Notification from "../modules/Notification.js";

const router = express.Router();

// Get Notifications
router.get("/", auth(), async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({
            userId: req.user.userId,
            read: false
        });

        res.json({ notifications, unreadCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark as Read
router.put("/:id/read", auth(), async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark All as Read
router.put("/read-all", auth(), async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.userId, read: false },
            { read: true }
        );
        res.json({ message: "All marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Create Notification (Internal/Admin use mainly, but exposed for demo if needed)
// Usually notifications are created by triggers in other flows (e.g. Appointment booking).

export default router;
