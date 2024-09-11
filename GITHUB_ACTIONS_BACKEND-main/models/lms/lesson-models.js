const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    batchId: { type: ObjectId, ref: "Batch" },
    addedBy: { type: ObjectId, ref: "User" },
    complete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", LessonSchema);
