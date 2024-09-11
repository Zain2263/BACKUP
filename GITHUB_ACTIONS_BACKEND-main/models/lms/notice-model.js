const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const NoticeSchema = new mongoose.Schema(
  {
    batchId: { type: ObjectId, ref: "Batch" },
    userId: { type: ObjectId, ref: "User" },
    heading: { type: String },
    text: { type: String },
    variant: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoticeBatch", NoticeSchema);
