const lessonModels = require("../../models/lms/lesson-models");

const addLesson = async (req, res) => {
  const { title, description } = req.body;

  const { batchId } = req.params;

  try {
    if (!title || !description) {
      return res.json({ error: "Title & Description is required" });
    }

    await new lessonModels({
      title,
      description,
      addedBy: req.user._id,
      batchId: batchId,
      complete: false,
    }).save();

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const updateLesson = async (req, res) => {
  const { title, description } = req.body;

  const { id } = req.params;

  try {
    if (!title || !description) {
      return res.json({ error: "Title & Description is required" });
    }

    const newPayloadData = {
      title,
      description,
    };
    await lessonModels.findByIdAndUpdate({ _id: id }, newPayloadData, {
      new: true,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    await lessonModels.findByIdAndDelete({ _id: id });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const makeItComplete = async (req, res) => {
  const { id } = req.params;

  try {
    await lessonModels.findByIdAndUpdate(
      { _id: id },
      { complete: true },
      {
        new: true,
      }
    );

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllLessonsByBatchId = async (req, res) => {
  const { batchId } = req.params;
  try {
    const batches = await lessonModels.find({ batchId: batchId });
    res.json(batches);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addLesson,
  updateLesson,
  deleteLesson,
  makeItComplete,
  getAllLessonsByBatchId,
};
