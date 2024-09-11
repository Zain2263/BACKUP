const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    overview: {},
    whyUs: {},
    prerequisites: {},
    benefits: {},
    marketValue: {},
    courseFor: {},

    monday: { type: Boolean },
    tuesday: { type: Boolean },
    wednesday: { type: Boolean },
    thursday: { type: Boolean },
    friday: { type: Boolean },
    saturday: { type: Boolean },

    duration: { type: String, required: true },
    classes: { type: Number, required: true },
    timming: { type: String, required: true },
    startingFrom: { type: String, required: true },
    regFee: { type: Number, required: true },
    courseFee: { type: Number, required: true },

    tags: [{ type: String }],
    categories: [{ type: String }],

    outline: {},
    faqs: [],
    lectures: [],
    faqs: [],

    categories: [{ type: ObjectId, ref: "Category" }],

    image: {
      url: String,
      public_id: String,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },

    instructor: {
      type: ObjectId,
      ref: "User",
    },

    published: { type: Boolean, default: true },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    show: { type: Boolean, default: true }, // hide in form
    show2: { type: Boolean, default: true }, // hide in programs page

    // for SEO
    seoTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
