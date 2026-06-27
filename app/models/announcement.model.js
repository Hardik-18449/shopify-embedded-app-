import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    announcement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);