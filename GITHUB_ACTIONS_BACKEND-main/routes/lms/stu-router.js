const express = require("express");
const { StuHasBatch, isStu } = require("../../middlewares/student-auth");
const { reqSignIn } = require("../../middlewares/auth");

const { getAllMyBatches, mySingleBatch } = require("../../controllers/lms/stu_cntrl");
const { getAllLessonsByBatchId } = require("../../controllers/lms/lesson_cntrl");
const { getAllFoldersByBatchId, addAssignments, removeAssignments, statsByBatchId } = require("../../controllers/lms/folder_cntrl");
const AssignmentUpload = require("../../helpers/assignmentUpload");

const router = express.Router();

router.get("/stu-all-batches", reqSignIn, isStu, getAllMyBatches);
router.get("/my-single-batch/:batchId", reqSignIn, isStu, StuHasBatch, mySingleBatch);

router.get("/my-all-lessons/:batchId", reqSignIn, isStu, StuHasBatch, getAllLessonsByBatchId);
router.get("/my-all-folders/:batchId", reqSignIn, isStu, StuHasBatch, getAllFoldersByBatchId);
// router.put("/stu-add-assignments/:id", reqSignIn, isStu, addAssignments);
router.put("/stu-add-assignments/:id", reqSignIn, isStu, AssignmentUpload.single("file"), (req, res) => {
  if (req.fileValidationError) {
    return res.json({ error: req.fileValidationError });
  }
  addAssignments(req, res);
});
router.put("/stu-remove-assignment/:id/:assignmentId", reqSignIn, isStu, removeAssignments);

// comes from folder contrl
router.get("/stu-batch-stats/:batchId", reqSignIn, isStu, statsByBatchId);

module.exports = router;
