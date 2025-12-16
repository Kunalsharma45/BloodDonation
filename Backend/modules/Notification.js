import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["REQUEST", "APPOINTMENT", "GENERAL"], default: "GENERAL" },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        data: { type: Object }, // Optional payload (e.g., requestId)
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
