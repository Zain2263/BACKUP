const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    batchId: { type: ObjectId, ref: "Batch" },
    commentBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentBatch", CommentSchema);
