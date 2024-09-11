const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const {
  uploadImage,
  removeImage,
  createCourse,
  allCourses,
  singleCourse,
  EditCourse,
  DeleteCourse,
  courseBySlug,
  gettingAllInstructors,
  deleteImage,
  allCoursesForForm,
  disableAnCourse,
  disableAnCourseFromPage,
  allCourses2,
} = require("../controllers/course");
const { reqSignIn, canCreateRead, canUpdateDeletePost, WritesAndReads } = require("../middlewares/auth");
const courseImagesUpload = require("../helpers/courseImagesUpload");

router.post(
  "/upload-image",
  reqSignIn,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  // canCreateRead, //becourse any one can update his images also
  uploadImage
);

router.post("/create-course", reqSignIn, WritesAndReads, courseImagesUpload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  createCourse(req, res);
});
router.post("/edit-course/:id", reqSignIn, WritesAndReads, courseImagesUpload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  EditCourse(req, res);
});

router.get("/admin-courses", reqSignIn, WritesAndReads, allCourses);
router.get("/admin/edit/course/:id", reqSignIn, WritesAndReads, singleCourse);
router.delete("/delete/course/:id", reqSignIn, WritesAndReads, DeleteCourse);
router.get("/get-all-instructors", reqSignIn, gettingAllInstructors);
router.put("/show-or-not/:id", reqSignIn, WritesAndReads, disableAnCourse);
router.put("/show-or-not-2/:id", reqSignIn, WritesAndReads, disableAnCourseFromPage);

// delete course image
router.post("/delete-image/:courseId", reqSignIn, canUpdateDeletePost, removeImage);
router.post("/deleteImage", reqSignIn, deleteImage);

// /admin/edit/course

router.get("/courses", allCourses);
router.get("/courses2", allCourses2);
router.get("/courses-form", allCoursesForForm);
router.get("/course/:slug", courseBySlug);

module.exports = router;
