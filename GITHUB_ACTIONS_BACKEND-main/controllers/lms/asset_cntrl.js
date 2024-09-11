const assetsModel = require("../../models/lms/assets-model");
const fs = require("fs");

const addAssets = async (req, res) => {
  const { title } = req.body;

  const { batchId } = req.params;

  try {
    if (!title) {
      return res.json({ error: "Title & File is required" });
    }
    // console.log("Before saving to database");
    await new assetsModel({
      title,
      file: req.file.path,
      addedBy: req.user._id,
      batchId: batchId,
    }).save();
    // console.log("After saving to database");

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAssets = async (req, res) => {
  const { title } = req.body;

  const { id } = req.params;

  try {
    if (!title) {
      return res.json({ error: "Title is required" });
    }

    const newPayloadData = {
      title,
    };
    await assetsModel.findByIdAndUpdate({ _id: id }, newPayloadData, {
      new: true,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteAssets = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  // return;

  try {
    // console.log(1);
    // const _asset = await assetsModel.findByIdnAdDelete({ _id: id });
    let _asset = await assetsModel.findByIdAndRemove(id);
    // console.log(2);
    fs.unlinkSync(_asset.file);
    // console.log(3);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllAssetssByBatchId = async (req, res) => {
  const { batchId } = req.params;
  try {
    const assets = await assetsModel.find({ batchId: batchId });
    res.json(assets);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addAssets,
  updateAssets,
  deleteAssets,
  getAllAssetssByBatchId,
};
