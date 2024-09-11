const batchComments = require("../../models/lms/bch_cmts-model");
const ReplyBatch = require("../../models/lms/reply-models");

const addComment = async (req, res) => {
  const { batchId } = req.params;
  const { text } = req.body;

  console.log("comment 1");

  if (!text) {
    return res.json({ error: "please add a text" });
  }

  try {
    console.log("comment 2");

    const newComment = new batchComments({
      text,
      commentBy: req.user._id,
      batchId,
    });

    console.log("comment 3");

    await newComment.save();

    console.log("comment 4");

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const addReply = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.json({ error: "please add a text" });
  }
  try {
    const newReply = new ReplyBatch({
      text,
      replyBy: req.user._id,
      commentId: id,
    });

    await newReply.save();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllComments = async (req, res) => {
  const { batchId } = req.params;

  try {
    const allcomments = await batchComments.find({ batchId }).populate("commentBy", "image _id name");
    res.json(allcomments);
  } catch (error) {
    console.log(error);
  }
};

const getAllReplies = async (req, res) => {
  const { id } = req.params;

  try {
    const allcomments = await ReplyBatch.find({ commentId: id }).populate("replyBy", "_id name image");
    res.json(allcomments);
  } catch (error) {
    console.log(error);
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const allcomments = await batchComments.findByIdAndUpdate({ _id: id }, { text }, { new: true });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const updateReply = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const allcomments = await ReplyBatch.findByIdAndUpdate({ _id: id }, { text }, { new: true });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const allcomments = await batchComments.findByIdAndDelete({ _id: id });
    const allreplies = await ReplyBatch.deleteMany({ commentId: id });

    res.json({ ok: true, allcomments, allreplies });
  } catch (error) {
    console.log(error);
  }
};

const deleteReply = async (req, res) => {
  const { id } = req.params;
  try {
    const allreplies = await ReplyBatch.findOneAndDelete({ _id: id });

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addComment,
  addReply,
  getAllComments,
  getAllReplies,
  updateComment,
  updateReply,
  deleteComment,
  deleteReply,
};
