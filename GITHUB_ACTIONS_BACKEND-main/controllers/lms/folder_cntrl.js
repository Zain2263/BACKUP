const assetsModel = require("../../models/lms/assets-model");
const batchModels = require("../../models/lms/batch-models");
const bch_cmtsModel = require("../../models/lms/bch_cmts-model");
const foldersModels = require("../../models/lms/folders-models");
const lessonModels = require("../../models/lms/lesson-models");
const noticeModel = require("../../models/lms/notice-model");
const fs = require("fs");

const createFolder = async (req, res) => {
  const { name } = req.body;

  const { batchId } = req.params;

  try {
    if (!name) {
      return res.json({ error: "Folder name is required" });
    }

    await new foldersModels({
      name,
      createdBy: req.user._id,
      batchId: batchId,
    }).save();

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const updateFolder = async (req, res) => {
  const { name } = req.body;

  const { id } = req.params;

  try {
    if (!name) {
      return res.json({ error: "name is required" });
    }

    const newPayloadData = {
      name,
    };
    await foldersModels.findByIdAndUpdate({ _id: id }, newPayloadData, {
      new: true,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    await foldersModels.findByIdAndRemove({ _id: id });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllFoldersByBatchId = async (req, res) => {
  const { batchId } = req.params;
  try {
    const folders = await foldersModels.find({ batchId: batchId });
    res.json(folders);
  } catch (error) {
    console.log(error);
  }
};
const addAssignments = async (req, res) => {
  const { id } = req.params;

  const { file_name } = req.body;

  try {
    const folder = await foldersModels.findById({ _id: id });

    if (!folder) {
      return res.json({ error: "not found" });
    }

    if (!req.file || !file_name) {
      return res.json({ error: "File is required" });
    }

    const payloadData = {
      stu_id: req.user._id,
      file: req.file.path,
      file_name,
    };

    folder.data.push(payloadData);

    const savedData = await folder.save();

    const singleData = savedData.data?.find((x) => x.file === req.file.path);

    return res.json({ ok: true, singleData });
  } catch (error) {
    console.log(error);
  }
};

const removeAssignments = async (req, res) => {
  const { id, assignmentId } = req.params;

  try {
    console.log(id, "here is id");
    const folder = await foldersModels.findById({ _id: id });

    if (!folder) {
      return res.json({ error: "not found" });
    }

    let _folderData = folder.data.find((x) => x._id.toString() === assignmentId);

    folder.data = folder.data.filter((x) => x._id.toString() !== assignmentId);

    fs.unlinkSync(_folderData.file);
    await folder.save();

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const statsByBatchId = async (req, res) => {
  const { batchId } = req.params;

  try {
    const foldersCount = await foldersModels.countDocuments({
      batchId: batchId,
    });

    const AssetsCount = await assetsModel.countDocuments({ batchId: batchId });

    const lessonsCount = await lessonModels.countDocuments({
      batchId: batchId,
    });

    const batch = await batchModels.findById({ _id: batchId }).select("title");

    const notice = await noticeModel.findOne({ batchId: batchId });
    const comments = await bch_cmtsModel.countDocuments({ batchId: batchId });

    res.json({
      assets: AssetsCount,
      folders: foldersCount,
      lessons: lessonsCount,
      notice,
      batch,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createFolder,
  updateFolder,
  deleteFolder,
  getAllFoldersByBatchId,
  addAssignments,
  removeAssignments,
  statsByBatchId,
};
