const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

// middlewares
const { reqSignIn, isAdmin, canCreateRead, canUpdateDeleteBlog, canDeleteMedia } = require("../middlewares/auth");
const {
  blogByAuthor,
  blogByCategory,
  blogCount,
  blogsForAdmin,
  createBlog,
  editBlog,
  getNumbers,
  media,
  removeBlog,
  removeMedia,
  uploadImage,
  uploadImageFile,
  allblogs,
  singleBlog,
  singleBlogById,
  ViewCountAdd,
  removeImage,
} = require("../controllers/blog");
const upload = require("../helpers/uploadFiles");
const BlogImageUpload = require("../helpers/blogsImageUpload");

router.post("/upload-image2", reqSignIn, isAdmin, uploadImage);
router.post("/upload-image-file", formidable(), reqSignIn, canCreateRead, uploadImageFile);

router.post("/delete-blog-image/:blogId", reqSignIn, canCreateRead, removeImage);

router.post("/create-blog", reqSignIn, canCreateRead, BlogImageUpload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  createBlog(req, res);
});
router.get("/blogs-for-admin", reqSignIn, canCreateRead, blogsForAdmin);
router.get("/media", reqSignIn, canCreateRead, media);
router.post("/media/:id", reqSignIn, canCreateRead, removeMedia);
router.get("/admin/blog/:id", reqSignIn, canDeleteMedia, singleBlogById);
router.put("/blog/:postId", reqSignIn, canCreateRead, BlogImageUpload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  editBlog(req, res);

  
});


router.delete("/blog/:postId", reqSignIn, canCreateRead, removeBlog);
router.get("/blog-count", blogCount);
// author
router.get("/posts-by-author", reqSignIn, blogByAuthor);

router.get("/numbers", getNumbers);
router.get("/blog-by-category/:slug", blogByCategory);

router.get("/blogs/:page", allblogs);
router.get("/blog/:slug", singleBlog);

router.get("/view-count/:slug", ViewCountAdd);

module.exports = router;
