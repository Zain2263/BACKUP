const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const WorkshopSchema = new mongoose.Schema(
  {
    breadTitle: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {},
    outlines: {},

    image: {
      url: String,
      public_id: String,
    },

    conclusion: { type: String, required: true },

    dateAndTime: { type: Date, required: true },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },

    instructor: {
      type: ObjectId,
      ref: "User",
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    categories: [{ type: ObjectId, ref: "Category" }],
    zoomLink: { type: String, required: true },
    meetingId: { type: String, required: true },
    pascodeId: { type: String, required: true },
    meetingTiming: { type: String, required: true },

    tags: {
      type: [String],
      required: true,
    },

    show: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("workshop", WorkshopSchema);
