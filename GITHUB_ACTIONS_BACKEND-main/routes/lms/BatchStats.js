const express = require("express");
const { reqSignIn, lmsRights } = require("../../middlewares/auth");
const payments = require("../../models/lms/payments");
const batchModels = require("../../models/lms/batch-models");
const foldersModels = require("../../models/lms/folders-models");
const Enroll = require("../../models/enroll");
const assetsModel = require("../../models/lms/assets-model");

const router = express.Router();

router.get("/all-payments", async (req, res) => {
  try {
    const allPayments = await payments.find({});
    res.json(allPayments);
  } catch (error) {
    console.log(error);
  }
});

router.get("/enrollments-batch", async (req, res) => {
  try {
    const batches = await batchModels.aggregate([
      {
        $project: {
          title: 1,
          enrolledStudentsCount: { $size: "$enrolledStudents" },
        },
      },
      { $sort: { enrolledStudentsCount: -1 } },
    ]);
    res.json(batches);
  } catch (error) {
    console.log(error);
  }
});

router.get("/course-by-batch", async (req, res) => {
  try {
    const batchCountByCourse = await batchModels.aggregate([
      {
        $group: {
          _id: "$courseDetails",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses", // Assuming the Course model is named 'Course'
          localField: "_id",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          courseTitle: "$courseDetails.title",
          count: 1,
        },
      },
    ]);

    res.json(batchCountByCourse);
  } catch (error) {
    console.error(error);
  }
});

router.get("/folders-by-batch", async (req, res) => {
  try {
    const results = await foldersModels
      .aggregate([
        {
          $group: {
            _id: "$batchId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "_id",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: "$batch",
        },
        {
          $project: {
            batchId: "$_id",
            batchTitle: "$batch.title",
            count: 1,
          },
        },
      ])
      .exec();

    res.json(results);
  } catch (err) {
    console.error(err);
  }
});

router.get("/batch-stats", async (req, res) => {
  try {
    const foldersCount = await foldersModels.countDocuments();
    const batchesCount = await batchModels.countDocuments();
    const enrollmentsCount = await Enroll.countDocuments();
    const assetsCount = await assetsModel.countDocuments();

    res.json({
      folders: foldersCount,
      batches: batchesCount,
      enrollments: enrollmentsCount,
      assets: assetsCount,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
