import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat]
      },
      address: { type: String },
    },
    capacity: { type: Number, default: 0 },
    registeredDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["PLANNED", "COMPLETED"], default: "PLANNED" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Camp", campSchema);

