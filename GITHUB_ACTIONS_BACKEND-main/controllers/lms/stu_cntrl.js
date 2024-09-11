const User = require("../../models/user");
const Batch = require("../../models/lms/batch-models");
const assetsModel = require("../../models/lms/assets-model");
const folderModel = require("../../models/lms/folders-models");
const commentsModel = require("../../models/lms/bch_cmts-model");
const lessonsModel = require("../../models/lms/lesson-models");
const noticeModel = require("../../models/lms/notice-model");

const getAllMyBatches = async (req, res) => {
  try {
    const allBatch = await User.findOne({
      _id: req.user._id,
    })
      .select("enrolledBatches")
      .populate({
        path: "enrolledBatches",
        select: "_id title courseDetails",
        populate: {
          path: "courseDetails",
          select: "image title",
        },
      });

    res.json(allBatch);
  } catch (error) {
    console.log(error);
  }
};

const mySingleBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    const myBatch = await Batch.findById({ _id: batchId }).select("title monday tuesday wednesday thursday friday saturday duration limit classes timming startDate endDate");

    // let assets;
    // let folders;
    // let comments;
    // let notice;
    // let lessons;

    // if (myBatch) {
    //   assets = await assetsModel.find({ batchId });
    //   folders = await folderModel.find({ batchId });
    //   comments = await commentsModel.find({ batchId });
    //   lessons = await lessonsModel.find({ batchId });
    //   notice = await noticeModel.find({ batchId });
    // }

    res.json({
      myBatch,
      // folders,
      // assets,
      // notice,
      // lessons,
      // comments,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMyBatches,
  mySingleBatch,
};
