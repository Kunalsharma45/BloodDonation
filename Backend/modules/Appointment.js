import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    dateTime: { type: Date, required: true },
    status: { type: String, enum: ["UPCOMING", "COMPLETED", "CANCELLED"], default: "UPCOMING" },
    notes: { type: String },
    unitsCollected: { type: Number },
    donationSuccessful: { type: Boolean },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Appointment", appointmentSchema);

