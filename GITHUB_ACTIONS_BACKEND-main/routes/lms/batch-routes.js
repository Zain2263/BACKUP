const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

// middlewares
const { lmsRights, reqSignIn, isInstructor, BatchCommentsRight } = require("../../middlewares/auth");

// controllers
const {
  getAllActiveBatches,
  getAllDeActiveBatches,
  createBatch,
  assigningTeachers,
  unAssigningTeacher,
  assigningStudents,
  unAssignStudents,
  singleBatch,
  updateBatch,
  completeBatch,
  AddStudentPayments,
  updatePaymentById,
  claimForCertifications,
  getBatchesWithHigherEnrollment,
  getBatchCountByCourse,
  whichBatchHasMoreFolders,
  whichBatchHasMoreAssets,
  getAllCompletedBatches,
  singleBatchStats,
  instructorBatches,
} = require("../../controllers/lms/batch_cntrl");
const { addOrUpdateNotice, getNotice } = require("../../controllers/lms/notice_cntrl");

// admins & cords
router.post("/create-batch", reqSignIn, lmsRights, createBatch);
router.put("/add/:batchId/teacher", reqSignIn, lmsRights, assigningTeachers);
router.put("/remove/:batchId/teacher", reqSignIn, lmsRights, unAssigningTeacher);
router.put("/add/:studentId/:batchId/student", reqSignIn, lmsRights, assigningStudents);
router.put("/remove/:studentId/:batchId/student", reqSignIn, lmsRights, unAssignStudents);
router.put("/make-batch/:batchId/complete", reqSignIn, lmsRights, completeBatch);

router.put("/update-batch/:id", reqSignIn, lmsRights, updateBatch);

// payment router
router.put("/add/:studentId/:batchId/payments", reqSignIn, lmsRights, AddStudentPayments);
router.put("/update/:studentId/:paymentId/:batchId/payments", reqSignIn, lmsRights, updatePaymentById);

router.get("/active-batches", reqSignIn, lmsRights, getAllActiveBatches);
router.get("/completed-batches", reqSignIn, lmsRights, getAllCompletedBatches);
router.get("/deactive-batches", reqSignIn, lmsRights, getAllDeActiveBatches);
router.get("/single-batch/:id", reqSignIn, lmsRights, singleBatch);
router.get("/batch-teacher/:id", reqSignIn, isInstructor, singleBatch);

// certification
router.put("/certifications/:studentId/:batchId", reqSignIn, claimForCertifications);

// batches with higher number of students
router.get("/batch-number-students", reqSignIn, lmsRights, getBatchesWithHigherEnrollment);
router.get("/batch-count-by-course", reqSignIn, lmsRights, getBatchCountByCourse);
router.get("/which-batch-more-folders", reqSignIn, lmsRights, whichBatchHasMoreFolders);
router.get("/which-batch-more-assets", reqSignIn, lmsRights, whichBatchHasMoreAssets);

// batch notice
router.post("/add-update-notice/:batchId", reqSignIn, isInstructor, addOrUpdateNotice);
router.get("/get-notice/:batchId", reqSignIn, BatchCommentsRight, getNotice);

// batch stats
router.get("/batch-stats/:batchId", reqSignIn, isInstructor, singleBatchStats);
router.get("/inst/my-batches", reqSignIn, isInstructor, instructorBatches);

module.exports = router;
