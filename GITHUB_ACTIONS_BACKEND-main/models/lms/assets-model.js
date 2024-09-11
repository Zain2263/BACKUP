const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const assetsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    file: { type: String, required: true },
    batchId: { type: ObjectId, ref: "Batch" },
    addedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetsSchema);
