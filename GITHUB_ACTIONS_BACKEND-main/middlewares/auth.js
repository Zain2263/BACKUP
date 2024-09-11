const User = require("../models/user");
const Course = require("../models/course");
const jwt = require("jsonwebtoken");
const Workshops = require("../models/workshops");
const Gallary = require("../models/gallary");

// const reqSignIn = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       console.log(
//         process.env.JWT_SECRET,
//         "Secret",
//         req.headers.authorization.startsWith("Bearer")
//       );
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(decoded, "from decode.");
//       req.user = await User.findById({ _id: decoded._id }).select("-password");
//       next();
//     } catch (error) {
//       console.error(error);

//       res.status(401).send("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401).send("Not authorized, token failed");
//   }
// };

// second 
const reqSignIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log(
        process.env.JWT_SECRET,
        "Secret",
        req.headers.authorization.startsWith("Bearer")
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded, "from decode.");
      req.user = await User.findById({ _id: decoded._id }).select("-password");
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).send("Not authorized, token failed");
    }
  } else {
    res.status(401).send("Not authorized, token failed");
  }
};

const isAdmin = async (req, res, cb) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(400).send("Unathorized");
    } else {
      cb();
    }
  } catch (err) {
    console.log(err);
  }
};

const isAuthor = async (req, res, cb) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "author") {
      return res.status(400).send("Unathorized");
    } else {
      cb();
    }
  } catch (err) {
    console.log(err);
  }
};

const canCreateRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canUpdateDeletePost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Course.findById(req.params.courseId);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      case "cord":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canUpdateDeleteWorkshop = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Workshops.findById(req.params.workshopId);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canUpdateDeleteBlog = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Course.findById(req.params.courseId);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canDeleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Gallary.findById(id);

    // you get req.user._id from verified jwt token
    const user = await User.findById(req.user._id);
    // console.log("isAdmin ===> ", user);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        next();
        break;
        // if (media.postedBy.toString() !== req.user._id.toString()) {
        //   return res.status(400).send("Unauthorized");
        // } else {
        //   next();
        // }
        break;
      default:
        return res.status(400).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const isInstructor = async (req, res, cb) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "instructor") {
      return res.status(400).send("Unathorized");
    } else {
      cb();
    }
  } catch (err) {
    console.log(err);
  }
};

const isCord = async (req, res, cb) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "cord") {
      return res.status(400).send("Unathorized");
    } else {
      cb();
    }
  } catch (err) {
    console.log(err);
  }
};

const lmsRights = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    switch (user.role) {
      case "cord":
        next();
        break;
      case "admin":
        next();
        break;
      default:
        return res.status(403).json({ error: "Unauhorizesssasdasdd", user });
    }
  } catch (err) {
    console.log(err);
  }
};

const cmsRights = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const BatchCommentsRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "instructor":
        next();
        break;
      case "student":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

// right for cord author, admin
// lms and cms
const WritesAndReads = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "admin":
        next();
        break;
      case "author":
        next();
        break;
      case "cord":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  reqSignIn,
  isAdmin,
  canCreateRead,
  canUpdateDeletePost,
  canUpdateDeleteWorkshop,
  canUpdateDeleteBlog,
  canDeleteMedia,
  isAuthor,
  lmsRights,
  isCord,
  isInstructor,
  cmsRights,
  BatchCommentsRight,
  WritesAndReads,
};
