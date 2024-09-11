const express = require("express");

const router = express.Router();

// middlewares
const { isInstructor, reqSignIn } = require("../../middlewares/auth");
const { createFolder, getAllFoldersByBatchId, updateFolder, deleteFolder, addAssignments, removeAssignments } = require("../../controllers/lms/folder_cntrl");
const AssignmentUpload = require("../../helpers/assignmentUpload");

// admins & cords
router.post("/create-folder/:batchId", reqSignIn, isInstructor, createFolder);
router.get("/all-folders/:batchId", reqSignIn, isInstructor, getAllFoldersByBatchId);

router.put("/update-folder/:id", reqSignIn, isInstructor, updateFolder);
router.delete("/delete-folder/:id", reqSignIn, isInstructor, deleteFolder);

router.put("/add-assignments/:id", reqSignIn, AssignmentUpload.single("file"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  addAssignments(req, res);
});
router.put("/remove-assignment/:id/:assignmentId", reqSignIn, removeAssignments);

module.exports = router;
