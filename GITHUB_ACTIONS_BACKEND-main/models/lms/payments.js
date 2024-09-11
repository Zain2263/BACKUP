const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const paymentSchema = new mongoose.Schema(
  {
    from: {
      type: ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    comment: { type: String, required: true },
    addedBy: {
      type: ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
