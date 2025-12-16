import mongoose from "mongoose";

const profileUpdateSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        currentData: { type: Object }, // Snapshot of data before update
        updates: {
            Name: String,
            City: String,
            PhoneNumber: String,
            bloodGroup: String,
            Gender: String,
            DateOfBirth: Date,
            State: String,
            Country: String
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        },
        adminReason: { type: String },
        processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        processedAt: { type: Date }
    },
    { timestamps: true }
);

profileUpdateSchema.index({ userId: 1, status: 1 });

export default mongoose.model("ProfileUpdate", profileUpdateSchema);
