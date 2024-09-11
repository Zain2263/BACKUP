const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

const { reqSignIn, canCreateRead, canUpdateDeleteWorkshop, cmsRights, lmsRights } = require("../middlewares/auth");
const { gettingAllInstructors, removeImage, uploadImage } = require("../controllers/course");
const {
  createWorkshop,
  allWorkshops,
  singleWorkshop,
  EditWorkshop,
  DeleteWorkshop,
  workshopBySlug,
  formWorkshops,
  disableAnWorkshop,
  WorkshopsFilters,
} = require("../controllers/workshops");
const BlogImageUpload = require("../helpers/blogsImageUpload");
const upload = require("../helpers/uploadFiles");

router.post("/upload-image", reqSignIn, formidable({ maxFileSize: 5 * 1024 * 1024 }), canCreateRead, uploadImage);

router.post("/create-workshop", reqSignIn, canCreateRead, upload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  createWorkshop(req, res);
});
router.get("/admin-workshops", reqSignIn, canCreateRead, allWorkshops);
router.get("/admin/edit/workshop/:id", reqSignIn, canCreateRead, singleWorkshop);
router.post("/edit-workshop/:id", reqSignIn, canCreateRead, upload.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  EditWorkshop(req, res);
});
router.delete("/delete/workshop/:id", reqSignIn, canUpdateDeleteWorkshop, DeleteWorkshop);

// common
router.get("/get-all-instructors", reqSignIn, gettingAllInstructors);
// delete workshop image
router.post("/delete-image/:workshopId", reqSignIn, canUpdateDeleteWorkshop, removeImage);

// /admin/edit/course

router.get("/all-workshops", allWorkshops);
router.get("/workshop/:slug", workshopBySlug);
router.get("/workshops-form", formWorkshops);
router.get("/workshopfilters", WorkshopsFilters);

router.put("/workshop/show-or-not/:id", reqSignIn, canCreateRead, disableAnWorkshop);

module.exports = router;
