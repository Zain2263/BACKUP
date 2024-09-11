const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

// middlewares
const {  isInstructor, reqSignIn } = require("../../middlewares/auth");
const { addLesson, updateLesson, getAllLessonsByBatchId, deleteLesson, makeItComplete } = require("../../controllers/lms/lesson_cntrl");

// admins & cords
router.post("/new-lesson/:batchId", reqSignIn,isInstructor,  addLesson);
router.put("/update-lesson/:id", reqSignIn,isInstructor,  updateLesson);
router.get("/all-lessons/:batchId", reqSignIn,isInstructor,  getAllLessonsByBatchId);
router.delete("/delete-lesson/:id", reqSignIn,isInstructor,  deleteLesson);
router.put("/make-lesson-complete/:id", reqSignIn,isInstructor,  makeItComplete);


// 

module.exports = router;
