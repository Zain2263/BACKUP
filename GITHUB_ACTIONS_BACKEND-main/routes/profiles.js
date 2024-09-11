const express = require("express");
const router = express.Router();

const { reqSignIn, BatchCommentsRight } = require("../middlewares/auth");
const { isStu } = require("../middlewares/student-auth");
const {
  createProfile,
  myProfile,
  addingSkills,
  mySkills,
  deleteSkill,
  addEducation,
  myEducation,
  deleteEducation,
  updateEducation,
  addExp,
  deleteExp,
  updateExp,
  myExp,
  myCertificates,
  addCertificate,
  deleteCertificate,
  updateCertificate,
  myPortfolio,
  addProject,
  deleteProject,
  updatePortfolio,
  profilePrivacy,
  publicEnable,
  publicProfiles,
  publicProfileDetail,
  myEnrollments,
  updateProfile,
  addEnrollmentInfo,
  myEnrollmentInfo,
} = require("../controllers/profiles");
const profileFileUploader = require("../helpers/ProfileImageUpload");

// get requests
router.get("/my-profile", reqSignIn, BatchCommentsRight, myProfile);
router.get("/my-skills", reqSignIn, BatchCommentsRight, mySkills);
router.get("/my-education", reqSignIn, BatchCommentsRight, myEducation);
router.get("/my-exp", reqSignIn, BatchCommentsRight, myExp);
router.get("/my-certificates", reqSignIn, BatchCommentsRight, myCertificates);
router.get("/my-portfolio", reqSignIn, BatchCommentsRight, myPortfolio);
router.get("/my-privacy", reqSignIn, BatchCommentsRight, profilePrivacy);
router.get("/profiles", publicProfiles);
router.get("/profile/:id", publicProfileDetail);
router.get("/my-enrollments", reqSignIn, myEnrollments);
router.get("/my-enrollment-info", reqSignIn, myEnrollmentInfo);

// post requests
// create or updateProfile
router.post("/_profile", reqSignIn, BatchCommentsRight, profileFileUploader.single("image"), (req, res) => {
  // Check if multer error is available and handle it
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }

  createProfile(req, res);
});

router.post("/update/_profile", reqSignIn, BatchCommentsRight, profileFileUploader.single("image"), (req, res) => {
  // Check if multer error is available and handle it
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }

  updateProfile(req, res);
});

// puts
router.put("/add-skills", reqSignIn, BatchCommentsRight, addingSkills);
router.put("/delete-skills", reqSignIn, BatchCommentsRight, deleteSkill);
router.put("/add-education", reqSignIn, BatchCommentsRight, addEducation);
router.put("/delete-education", reqSignIn, BatchCommentsRight, deleteEducation);
router.put("/edit-education", reqSignIn, BatchCommentsRight, updateEducation);
router.put("/add-exp", reqSignIn, BatchCommentsRight, addExp);
router.put("/delete-exp", reqSignIn, BatchCommentsRight, deleteExp);
router.put("/edit-exp", reqSignIn, BatchCommentsRight, updateExp);

router.put("/add-certificate", reqSignIn, BatchCommentsRight, addCertificate);
router.put("/delete-certificate", reqSignIn, BatchCommentsRight, deleteCertificate);
router.put("/edit-certificate", reqSignIn, BatchCommentsRight, updateCertificate);

router.put("/add-project", reqSignIn, BatchCommentsRight, addProject);
router.put("/delete-project", reqSignIn, BatchCommentsRight, deleteProject);
router.put("/edit-portfolio", reqSignIn, BatchCommentsRight, updatePortfolio);
router.put("/update-privacy", reqSignIn, BatchCommentsRight, publicEnable);
router.put("/update-enrollment-info", reqSignIn, BatchCommentsRight, addEnrollmentInfo);

module.exports = router;
