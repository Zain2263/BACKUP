const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    role: { type: String, default: "student", required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    passwordResetOTP: {
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
    image: {
      url: String,
      public_id: String,
    },
    status: {
      type: String,
    },

    exp: {
      type: String,
    },

    enrolledBatches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],

    payments: [
      {
        completed: { type: Boolean, default: false },
        amount: { type: Number, default: 0 },
        comment: { type: String },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
        addBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    unAssignedCount: { type: Number, default: 0 },

    completedBatches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],

    certifications: [
      {
        batch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Batch",
        },
        at: {
          type: Date,
        },
      },
    ],

    // for teachers
    assignedBatches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
