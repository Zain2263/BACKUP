const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const gallarySchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallary", gallarySchema);
