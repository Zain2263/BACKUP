const express = require("express");
const Comment = require('../models/comments')
const router = express.Router();

router.post("/add", async (req, res) => {
  const { name, email, key, comment } = req.body;

  try {
    if (!name) {
      return res.status(422).json({
        message: "Please Type Your Name",
      });
    } else if (!email) {
      return res.status(422).json({
        message: "Email is required",
      });
    } else if (!comment) {
      return res.status(422).json({
        message: "Please Add Your Comment",
      });
    }

    const newComment = new Comment({
      name,
      email,
      key,
      comment,
    });

    const added = await newComment.save();

    res.status(200).json({
      added,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.get("/get-comments/:key", async (req, res) => {
  try {
    const allComments = await Comment.find({ key: req.params.key }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      allComments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: error.message,
    });
  }
});

module.exports = router;
