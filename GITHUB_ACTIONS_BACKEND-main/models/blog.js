const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {},
    categories: [{ type: ObjectId, ref: "Category" }],
    // featuredImage: { type: ObjectId, ref: "Gallary" },

    viewCount: { type: Number, default: 0 },

    image: {
      url: String,
      public_id: String,
    },

    published: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },

    tags: {
      type: [String],
      required: true,
    },

    seoTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
