const mongoose = require("mongoose");

const enrollSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    idCard: { type: String },
    phoneNumber: { type: String, required: true },
    whatsAppphoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },

    parentName: { type: String, required: true },
    parentOccupations: { type: String, required: true },
    parentPhoneNumber: { type: String },

    gender: { type: String, required: true },

    interest: { type: String },
    wantToAchieve: { type: String },

    course: { type: String },
    workshop: { type: String },

    education: { type: String, required: true },

    enrollTo: { type: String, required: true },

    rejected: { type: Boolean, defaultValue: false },
    isPaid: { type: Boolean, defaultValue: false },
    approved: { type: Boolean, defaultValue: false },
    registered: { type: Boolean, defaultValue: false },

    policyAccepted: { type: Boolean, defaultValue: false },
  },
  { timestamps: true }
);

const Enroll = mongoose.model("Enroll", enrollSchema);
module.exports = Enroll;
