import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, default: "GENERAL", trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export default mongoose.model("Notification", notificationSchema);
