const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const ReplySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    commentId: { type: ObjectId, ref: "CommentBatch" },
    replyBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReplyBatch", ReplySchema);
