const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const logSchema = new mongoose.Schema(
  {
    actionBy: {
      type: ObjectId,
      ref: "User",
    },
    performedFunction: {
      type: String,
      required: true,
    },
    onUser: { type: ObjectId, ref: "User" },
    comment: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
