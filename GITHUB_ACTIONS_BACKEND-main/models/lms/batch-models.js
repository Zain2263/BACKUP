const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const BatchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    monday: { type: Boolean },
    tuesday: { type: Boolean },
    wednesday: { type: Boolean },
    thursday: { type: Boolean },
    friday: { type: Boolean },
    saturday: { type: Boolean },

    duration: { type: String, required: true },
    limit: { type: Number, required: true },

    classes: { type: Number, required: true },
    timming: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    deactive: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },

    courseDetails: { type: ObjectId, ref: "Course" },
    createdBy: { type: ObjectId, ref: "User" },

    enrolledStudents: [{ type: ObjectId, ref: "User" }],
    teachers: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", BatchSchema);
