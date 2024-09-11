const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  currentUser,
  GetAllUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
  updateUserByUser,
  updateUserByAdmin,
  DeleteUserImage,
  allStudents,
  allTeachers,
  enrollStudents,
  requestForPorgetPassword,
  resetPassword,
  RegisterSimpleStudent,
  DeleteUserImageByAdmin,
} = require("../controllers/auth");
const {
  reqSignIn,
  isAdmin,
  canCreateRead,
  isAuthor,
  lmsRights,
  cmsRights,
  isInstructor,
  BatchCommentsRight,
} = require("../middlewares/auth");
const { isStu } = require("../middlewares/student-auth");
const profileFileUploader = require("../helpers/ProfileImageUpload");

router.post("/register", reqSignIn, canCreateRead, Register);
router.post("/login", Login);
router.get("/current-user", reqSignIn, currentUser);
router.get("/single-user/:id", reqSignIn, GetUser);
router.put("/update-profile", reqSignIn, UpdateUser);

router.get("/admin/all-user", reqSignIn, isAdmin, GetAllUsers);
router.delete("/admin/delete/:id", reqSignIn, isAdmin, DeleteUser);
router.get(`/current-admin`, reqSignIn, isAdmin, currentUser);
router.get(`/current-employee`, reqSignIn, isAuthor, currentUser);
router.get(`/current-cord`, reqSignIn, lmsRights, currentUser);
router.get(`/current-teacher`, reqSignIn, isInstructor, currentUser);
router.get(`/current-student-or-instructor`, reqSignIn, BatchCommentsRight, currentUser);

router.get(`/current-cms-user`, reqSignIn, cmsRights, currentUser);
router.get(`/current-lms-user`, reqSignIn, lmsRights, currentUser);

// updates
router.put("/update-user-by-user", reqSignIn, profileFileUploader.single("image"), (req, res) => {
  // Check if multer error is available and handle it
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }

  updateUserByUser(req, res);
});
router.put("/update-user-by-admin", reqSignIn, isAdmin, profileFileUploader.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  updateUserByAdmin(req, res);
});

// delete profile iage
router.post("/delete-image", reqSignIn, DeleteUserImage);
router.post("/delete-image-admin", reqSignIn, cmsRights, DeleteUserImageByAdmin);

router.get("/students", reqSignIn, lmsRights, allStudents);
router.get("/instructors", reqSignIn, lmsRights, allTeachers);
router.get("/enrolled-students", reqSignIn, lmsRights, enrollStudents);

// forget password
router.post("/request-forget-password", requestForPorgetPassword);
router.post("/reset-password", resetPassword);

// simple user registered as student
router.post("/auth/register", RegisterSimpleStudent);
router.get(`/current-student`, reqSignIn, isStu, currentUser);

module.exports = router;
