const express = require("express");

const router = express.Router();

// middlewares
const { isInstructor, reqSignIn } = require("../../middlewares/auth");
const { addAssets, updateAssets, deleteAssets, getAllAssetssByBatchId } = require("../../controllers/lms/asset_cntrl");
const { isStu } = require("../../middlewares/student-auth");
const AssetUploader = require("../../helpers/AssetUpload");

// admins & cords
router.post("/new-asset/:batchId", reqSignIn, isInstructor, AssetUploader.single("file"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  addAssets(req, res);
});

// router.post("/new-asset/:batchId", reqSignIn, isInstructor, addAssets);

router.put("/update-asset/:id", reqSignIn, isInstructor, updateAssets);
router.delete("/delete-asset/:id", reqSignIn, isInstructor, deleteAssets);

router.get("/all-assets/:batchId", reqSignIn, isInstructor, getAllAssetssByBatchId);

router.get("/stu-assets/:batchId", reqSignIn, isStu, getAllAssetssByBatchId);

module.exports = router;
