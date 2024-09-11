const Batch = require("../../models/lms/batch-models");
const Payments = require("../../models/lms/payments");
const User = require("../../models/user");
const Log = require("../../models/lms/logs");
const foldersModels = require("../../models/lms/folders-models");
const AssetsModel = require("../../models/lms/assets-model");
const CommentModel = require("../../models/lms/bch_cmts-model");
const assetsModel = require("../../models/lms/assets-model");
const lessonModels = require("../../models/lms/lesson-models");

const createBatch = async (req, res) => {
  const { title, duration, limit, classes, timming, startDate, endDate, courseDetails } = req.body;

  try {
    if (!title || !duration || !limit || !classes || !timming || !startDate || !endDate || !courseDetails) {
      return res.json({ error: "All fields are requried**" });
    }

    const alreadyExist = await Batch.findOne({ title });
    if (alreadyExist) {
      return res.json({ error: "Already Exists**" });
    }

    const payloadData = {
      ...req.body,
      createdBy: req.user._id,
      deactive: false,
      completed: false,
      createdBy: req.user._id,
    };

    const dataIsGoingToSaved = await new Batch(payloadData).save();
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

// assigning teachers
const assigningTeachers = async (req, res) => {
  const { batchId } = req.params;
  const { teacherId } = req.body;

  try {
    const batch = await Batch.findById({ _id: batchId });
    const user = await User.findById({ _id: teacherId });

    if (!batch || !user) {
      return res.json({ error: "Ids are not found" });
    }

    // if (user.assignedBatches.includes(batchId)) {
    //   return res.json({ error: "batch is already assigned" });
    // }

    if (batch.teachers.includes(teacherId)) {
      return res.json({ error: "Teacher is already assign to batch" });
    }

    // Add the teacherIds to the teachers array in the batch
    batch.teachers.push(teacherId);
    user.assignedBatches.push(batchId);

    // Save the updated batch with the added teachers
    await batch.save();
    await user.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const unAssigningTeacher = async (req, res) => {
  const { batchId } = req.params;
  const { teacherId } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(teacherId);

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Find the batch by batchId
    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.json({ error: "Batch not found" });
    }

    // Remove the batchId from the assignedBatches array in the user
    user.assignedBatches = user.assignedBatches.filter((assignedBatch) => assignedBatch.toString() !== batchId);

    // Remove the userId from the teachers array in the batch
    batch.teachers = batch.teachers.filter((teacher) => teacher.toString() !== teacherId);

    // Save the updated user and batch
    // console.log("c")
    await user.save();
    await batch.save();

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

// assigning Studnets
// assigning Studnets
const assigningStudents = async (req, res) => {
  const { studentId, batchId } = req.params;

  try {
    // Step 1: Find the student
    const student = await User.findById(studentId).populate("enrolledBatches", "_id");
    const batch = await Batch.findById(batchId).populate("courseDetails", "_id");

    // console.log(batch, "from the firsts");

    // Step 2: Check if the student exists
    if (!student) {
      return res.json({ error: "Error :| " });
    }

    if (!batch) {
      return res.json({ error: "Error :| " });
    }

    let enrollmentCount = student.enrolledBatches.length;

    // Step 3: Check the number of enrollment batches
    if (enrollmentCount >= 2) {
      return res.json({
        error: "Student has reached the maximum number of enrollments",
      });
    }

    if (enrollmentCount === 0) {
      // Step 4: Check the payment status and amount
      // Step 5: Assign the batch to the student
      student.enrolledBatches.push(batchId);

      // Step 6: Update the enrolledStudents array in the batch
      const batch = await Batch.findById(batchId);
      if (batch) {
        batch.enrolledStudents.push(studentId);
        await batch.save();
      }

      // Save the updated student
      await student.save();

      return res.status(200).json({ message: "Batch assigned to student successfully" });
    } else if (enrollmentCount === 1) {
      // aviod to enroll into the same batch
      const batch = await Batch.findById(batchId).populate("courseDetails", "_id");
      // console.log(student.enrolledBatches[0]._id, "student from");
      // console.log(batch.courseDetails._id, "student");

      if (student.enrolledBatches.includes(batchId)) {
        return res.json({ error: "he has already this batch" });
      }

      if (student.enrolledBatches[0]._id.toString() === batch.courseDetails._id.toString()) {
        return res.json({
          error: "He has already enrolled into the course batch",
        });
      }

      // console.log("at this stage at 200 line");

      // Step 4: Check the payment status and amount
      // Step 5: Assign the batch to the student
      student.enrolledBatches.push(batchId);

      // Step 6: Update the enrolledStudents array in the batch

      if (batch) {
        batch.enrolledStudents.push(studentId);
        await batch.save();
      }

      // Save the updated student
      await student.save();

      return res.status(200).json({ message: "Batch assigned to student successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const AddStudentPayments = async (req, res) => {
  const { studentId, batchId } = req.params;
  const { completed, amount, comment } = req.body;

  try {
    const student = await User.findOne({ _id: studentId });

    const payloadData = {
      completed: completed,
      amount: amount,
      comment: comment,
      batch: batchId,
      addBy: req.user._id,
    };

    const paymentsLog = {
      from: studentId,
      addedBy: req.user._id,
      amount,
      comment,
    };

    const addedPyments = await new Payments(paymentsLog).save();

    student.payments.push(payloadData);

    await student.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const updatePaymentById = async (req, res) => {
  const { studentId, paymentId, batchId } = req.params;

  try {
    const user = await User.findById(studentId);
    const batch = await Batch.findById(batchId);

    console.log(req.body.completed, req.body.comment, req.body.amount);

    const payment = user.payments.find((x) => x._id.toString() === paymentId);

    payment.completed = req.body.completed;

    payment.comment = req.body.comment ? req.body.comment : payment.comment;
    payment.amount = req.body.amount ? req.body.amount : payment.amount;

    await user.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const unAssignStudents = async (req, res) => {
  const { studentId, batchId } = req.params;

  try {
    const student = await User.findOne({ _id: studentId });
    const batch = await Batch.findOne({ _id: batchId });

    const enrollmentCount = student.enrolledBatches.length;

    if (enrollmentCount === 2) {
      student.enrolledBatches = student.enrolledBatches.filter((x) => x.toString() !== batchId);

      student.unAssignedCount++;

      batch.enrolledStudents = batch.enrolledStudents.filter((stu) => stu.toString() !== studentId);

      const newLogs = new Log({
        actionBy: req.user._id,
        performedFunction: "Un Assigned Course",
        onUser: studentId,
      });

      await newLogs.save();
      await batch.save();
      await student.save();

      res.json({ ok: true, student });
    } else if (enrollmentCount === 1) {
      student.enrolledBatches = student.enrolledBatches.filter((x) => x.toString() !== batchId);
      student.unAssignedCount++;
      batch.enrolledStudents = batch.enrolledStudents.filter((stu) => stu.toString() !== studentId);

      const newLogs = new Log({
        actionBy: req.user._id,
        performedFunction: "Un Assigned Course",
        onUser: studentId,
      });

      await newLogs.save();
      await batch.save();
      await student.save();
      res.json({ ok: true, student });
    } else {
      res.json({ error: "Error" });
    }
  } catch (error) {
    console.log(error);
  }
};

// by id
const updateBatch = async (req, res) => {
  const { title, duration, limit, classes, timming, startDate, endDate, courseDetails } = req.body;

  try {
    if (!title || !duration || !limit || !classes || !timming || !startDate || !endDate || !courseDetails) {
      return res.json({ error: "All fields are requried**" });
    }

    const updatedData = {
      ...req.body,
    };

    if (req.body.deactive) {
      updatedData.deactive = req.body.deactive;
    }

    if (req.body.completed) {
      updatedData.completed = req.body.completed;
    }

    const dataIsGoingToSaved = await Batch.findByIdAndUpdate({ _id: req.params.id }, updatedData, { new: true });
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

// make batch complete batch
const completeBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findByIdAndUpdate(batchId, { completed: true });

    const enrolledUsers = await User.find({ enrolledBatches: batchId });

    // console.log(enrolledUsers, batch, "update as completed");

    // Update the enrolled users' documents
    const updatePromises = enrolledUsers.map(async (user) => {
      // Remove the batch ID from enrolledBatches array
      user.enrolledBatches = user.enrolledBatches.filter((batch) => batch.toString() !== batchId);

      // Add the batch ID to completedBatches array
      user.completedBatches.push(batchId);

      // Save the updated user document
      await user.save();
    });

    // Execute all the update promises concurrently
    await Promise.all(updatePromises);

    // Return a success message or relevant data
    return res.json({
      message: "Batch marked as complete and user records updated.",
    });
  } catch (error) {
    console.log(error);
  }
};

const claimForCertifications = async (req, res) => {
  const { studentId, batchId } = req.params;

  try {
    const user = await User.findById(studentId);
    const batch = await Batch.findById(batchId);

    if (batch.completed) {
      const payment = user.payments.find((x) => x.batch.toString() === batchId);
      if (payment.completed) {
        user.completedBatches = user.completedBatches.filter((x) => x.toString() !== batchId);

        const newCertificationData = {
          batch: batchId,
          at: Date.now(),
        };
        user.certifications.push(newCertificationData);

        await user.save();
        res.json({ ok: true });
      } else {
        return res.json({ error: "ERROR PINC" });
      }
    } else {
      return res.json({ error: " ERROR BINC" });
    }
  } catch (error) {
    console.log(error);
  }
};

const dropStudent = () => {};
const makeDeActiveBatch = () => {};

const deleteBatch = () => {};

const getAllActiveBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ deactive: false, completed: false })
      .populate({
        path: "enrolledStudents",
        select: "_id name",
        populate: {
          path: "payments",
          select: "_id amount completed",
          populate: {
            path: "batch",
            select: "_id title",
          },
        },
      })
      .populate("teachers", "name _id")
      .populate("courseDetails", "_id title");
    res.json(batches);
  } catch (error) {
    console.log(error);
  }
};

const getAllCompletedBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ completed: true })
      .populate({
        path: "enrolledStudents",
        select: "_id name certifications",
        populate: {
          path: "payments",
          select: "_id amount completed",
          populate: {
            path: "batch",
            select: "_id title",
          },
        },
      })
      .populate("teachers", "name _id")
      .populate("courseDetails", "_id title");
    res.json(batches);
  } catch (error) {
    console.log(error);
  }
};

const getAllDeActiveBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ deactive: true });
    res.json(batches);
  } catch (error) {
    console.log(error);
  }
};

const singleBatch = async (req, res) => {
  try {
    const batch = await Batch.findOne({ _id: req.params.id }).populate("courseDetails", "_id title");
    // console.log(batch, "sinle");
    res.json(batch);
  } catch (error) {
    console.log(error);
  }
};

const getBatchesWithHigherEnrollment = async (req, res) => {
  try {
    const batches = await Batch.aggregate([
      {
        $project: {
          title: 1,
          enrolledStudentsCount: { $size: "$enrolledStudents" },
        },
      },
      { $sort: { enrolledStudentsCount: -1 } },
    ]);

    return res.json(batches);
  } catch (error) {
    console.log("Error fetching batches:", error);
    throw error;
  }
};

const getBatchCountByCourse = async (req, res) => {
  try {
    const batchCountByCourse = await Batch.aggregate([
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

    return res.json(batchCountByCourse);
  } catch (error) {
    console.error("Error retrieving batch count by course:", error);
    throw error;
  }
};

const whichBatchHasMoreFolders = async (req, res) => {
  // Retrieving folders with populated batch
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
    return res.json(results);
  } catch (err) {
    console.error(err);
    // Handle error
  }
};

const whichBatchHasMoreAssets = async (req, res) => {
  // Retrieving folders with populated batch
  try {
    const results = await AssetsModel.aggregate([
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
    ]).exec();
    return res.json(results);
  } catch (err) {
    console.error(err);
    // Handle error
  }
};

const singleBatchStats = async (req, res) => {
  const { batchId } = req.params;
  try {
    const singelBatchStats = await Batch.findById({ _id: batchId }).populate("courseDetails", "_id title");

    const assetCount = await assetsModel.countDocuments({ batchId: batchId });
    const folderCount = await foldersModels.countDocuments({
      batchId: batchId,
    });
    const commentCount = await CommentModel.countDocuments({
      batchId: batchId,
    });
    const lessonCount = await lessonModels.countDocuments({ batchId: batchId });

    res.json({
      batch: singelBatchStats,
      assets: assetCount,
      folders: folderCount,
      lessons: lessonCount,
      comments: commentCount,
    });
  } catch (error) {
    console.log(error);
  }
};

const instructorBatches = async (req, res) => {
  try {
    const _batches = await User.findOne({ _id: req.user._id })
      .select("assignedBatches")
      .populate({
        path: "assignedBatches",
        select: "title _id",
        populate: {
          path: "courseDetails",
          select: "image title _id",
        },
      });
    if (!_batches) {
      return res.json({ error: "Not found" });
    }

    res.json({ batches: _batches.assignedBatches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createBatch,
  getAllActiveBatches,
  getAllDeActiveBatches,
  updateBatch,
  makeDeActiveBatch,
  deleteBatch,
  dropStudent,
  assigningTeachers,
  unAssigningTeacher,
  assigningStudents,
  AddStudentPayments,
  unAssignStudents,
  singleBatch,
  completeBatch,
  updatePaymentById,
  claimForCertifications,
  getBatchesWithHigherEnrollment,
  getBatchCountByCourse,
  whichBatchHasMoreFolders,
  whichBatchHasMoreAssets,
  getAllCompletedBatches,
  singleBatchStats,
  instructorBatches,
};
