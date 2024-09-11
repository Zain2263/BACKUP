const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
    },
    bio: {
      type: String,
    },

    public: { type: Boolean, default: false },

    skills: [{ type: String, required: true }],

    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        typeOfJob: {
          type: String,
        },
        skills: { type: String },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
      behance: {
        type: String,
      },
      github: {
        type: String,
      },
    },

    certificates: [
      {
        title: {
          type: String,
          required: true,
        },
        platform: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],

    portfolio: [
      {
        title: {
          type: String,
          required: true,
        },
        link: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],

    enrollmentInfo: {
      idCard: { type: String },
      phoneNumber: { type: String },
      whatsAppphoneNumber: { type: String },
      address: { type: String },
      city: { type: String },
      dateOfBirth: { type: Date },

      parentName: { type: String },
      parentOccupations: { type: String },
      parentPhoneNumber: { type: String },

      gender: { type: String },

      interest: { type: String },
      wantToAchieve: { type: String },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
