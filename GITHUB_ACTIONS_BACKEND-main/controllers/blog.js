const slugify = require("slugify");
const cloudinary = require("cloudinary");
const User = require("../models/user");
const Category = require("../models/category");
const Blog = require("../models/blog");
const Gallary = require("../models/gallary");
const Workshops = require("../models/workshops");
const Course = require("../models/course");
const fs = require("fs");

cloudinary.config({
  cloud_name: "ddwj52jk1",
  api_key: "612664661875291",
  api_secret: "iO9cuKSSNcP2BxYh0NJAyD_px-o",
});

const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const uploadImageFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.file.path);
    const media = await new Gallary({
      url: result.secure_url,
      public_id: result.public_id,
      postedBy: req.user._id,
    }).save();
    res.json(media);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const createBlog = async (req, res) => {
  // console.log("create blogs");
  const { title, content, categories, slug, seoTitle, metaDescription, image, tags, description } = req.body;

  try {
    const alreadyExist = await Blog.findOne({ slug });
    if (alreadyExist) return res.json({ error: "Title is taken" });

    if (alreadyExist) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.json({ error: "Title is taken" });
    }

    // // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({ name: categories[i] });
      // console.log(cat, "indexx", i);
      ids.push(cat._id);
    }

    let payloadData = {
      title,
      description,
      content,
      categories: ids,
      slug: slugify(title.toLowerCase()),
      seoTitle,
      metaDescription,
      image: {
        url: req.file ? req.file.path : undefined,
      },
      tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => " " + tag.trim()),
      postedBy: req.user._id,
      viewCount: 0,
    };

    // console.log(payloadData, "yes or not");

    setTimeout(async () => {
      const newPost = await new Blog(payloadData).save();
      return res.json(newPost);
    }, 1000);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const blogsForAdmin = async (req, res) => {
  try {
    const posts = await Blog.find({}).populate("postedBy", "_id name").populate("categories", "_id name slug").populate("image", "url").sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const allblogs = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const searchQuery = req.query.search; // Assuming the search query parameter is passed as '?search=<query>'

    const query = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } }, // Searching in the 'title' field using case-insensitive regex
        // { description: { $regex: searchQuery, $options: "i" } }, // Searching in the 'content' field using case-insensitive regex
      ];
    }

    const posts = await Blog.find(query)
      .skip((page - 1) * perPage)
      .populate("postedBy", "_id name image")
      .populate("categories", "_id name slug")
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();

    const recentBlogs = await Blog.find({}).populate("_id title createdAt slug").sort({ createdAt: -1 }).limit(4);

    const mostView = await Blog.find({}).populate("_id title createdAt slug").sort({ viewCount: -1 }).limit(4);

    const categories = await Category.find({});

    return res.json({ blogs: posts, recentBlogs, categories, mostView });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const media = async (req, res) => {
  try {
    const media = await Gallary.find({}).populate("postedBy", "_id").sort({ createdAt: -1 });
    return res.json(media);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const removeMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Gallary.findByIdAndDelete(id);
    const result = await cloudinary.uploader.destroy(req.body.public_id);
    // console.log(result, "delteing media");
    return res.json({ ok: true, result });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const singleBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Blog.findOne({ slug }).populate("postedBy", "_id name image status exp").populate("categories", "_id name slug");

    const categories = await Category.find({});

    const recentBlogs = await Blog.find({}).populate("_id title createdAt slug").sort({ createdAt: -1 }).limit(4);

    const mostView = await Blog.find({}).populate("_id title createdAt slug").sort({ viewCount: -1 }).limit(4);

    return res.json({ blog: post, categories, recentBlogs, mostView });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const singleBlogById = async (req, res) => {
  try {
    // console.log("single blog by id", req.params.id);
    const { id } = req.params;
    const post = await Blog.findOne({ _id: id }).populate("postedBy", "_id name").populate("categories", "_id name slug");

    // console.log(post, "here is ");
    return res.json(post);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const removeBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Blog.findByIdAndDelete(postId);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const editBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, slug, image, categories, seoTitle, metaDescription, tags, description } = req.body;

    // console.log(title, content, slug, image, categories, seoTitle, metaDescription, tags, description);
    // return;

    if (!title || !content || !categories || !seoTitle || !metaDescription || !description) {
      return res.json({ error: "All fields are requried" });
    }

    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({ name: categories[i] });
      ids.push(cat._id);
    }

    const existingPost = await Blog.findById(postId);

    if (req.file && existingPost.image && existingPost.image.url) {
      // Delete the old image from the filesystem
      fs.unlink(existingPost.image.url, (err) => {
        if (err) console.error(`Error deleting file: ${existingPost.image.url}`, err);
      });
    }

    let payloadData = {
      title,
      content,
      categories: ids,
      slug: slugify(title.toLowerCase()),
      seoTitle,
      metaDescription,
      description,
      image: {
        url: req.file ? req.file.path : existingPost.image.url,
      },
      tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => " " + tag.trim()),
    };

    setTimeout(async () => {
      const post = await Blog.findByIdAndUpdate(postId, payloadData, {
        new: true,
      })
        .populate("postedBy", "_id name")
        .populate("categories", "_id name slug");

      return res.json(post);
    }, 1000);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const blogByAuthor = async (req, res) => {
  try {
    const posts = await Blog.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .populate("categories", "_id name slug")
      .populate("featuredImage", "url")
      .sort({ createdAt: -1 })
      .exec();
    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const blogCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    return res.json(count);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const getNumbers = async (req, res) => {
  try {
    const blogs = await Blog.countDocuments();
    const users = await User.countDocuments();
    const categories = await Category.countDocuments();
    const workshops = await Workshops.countDocuments();
    const courses = await Course.countDocuments();
    return res.json({
      blogs,
      users,
      categories,
      workshops,
      courses,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const blogByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    const searchQuery = req.query.search; // Assuming the search query parameter is passed as '?search=<query>'

    const query = {
      categories: category._id,
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } }, // Searching in the 'title' field using case-insensitive regex
        // { description: { $regex: searchQuery, $options: "i" } }, // Searching in the 'content' field using case-insensitive regex
      ];
    }

    const posts = await Blog.find(query).populate("postedBy", "_id name image").populate("categories", "_id name slug").sort({ createdAt: -1 }).limit(24).exec();

    const recentBlogs = await Blog.find({}).populate("_id title createdAt slug").sort({ createdAt: -1 }).limit(4);

    const mostView = await Blog.find({}).populate("_id title createdAt slug").sort({ viewCount: -1 }).limit(4);

    const categories = await Category.find({});

    res.json({ category, blogs: posts, recentBlogs, mostView, categories });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const ViewCountAdd = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Blog.findOne({ slug });
    post.viewCount += 1;
    await post.save();
    res.json({ ok: true });
  } catch (error) {}
};

const removeImage = async (req, res) => {
  try {
    const findedCourse = await Blog.findById({ _id: req.params.blogId });
    findedCourse.image = {};
    await findedCourse.save();
    const result = await cloudinary.uploader.destroy(req.body.filepath);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploadImage,
  uploadImageFile,
  createBlog,
  blogsForAdmin,
  allblogs,
  media,
  removeMedia,
  singleBlog,
  removeBlog,
  editBlog,
  blogByAuthor,
  blogCount,
  getNumbers,
  blogByCategory,
  singleBlogById,
  ViewCountAdd,
  removeImage,
};
