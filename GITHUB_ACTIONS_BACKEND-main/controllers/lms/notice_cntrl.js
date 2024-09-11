const noticeModel = require("../../models/lms/notice-model");

const addOrUpdateNotice = async (req, res) => {
  const { batchId } = req.params;

  const { heading, text, variant } = req.body;

  try {
    const findedNoticed = await noticeModel.findOne({ batchId });
    if (findedNoticed) {
      findedNoticed.variant = variant ? variant : findedNoticed.variant;
      findedNoticed.heading = heading ? heading : findedNoticed.heading;
      findedNoticed.text = text ? text : findedNoticed.text;

      await findedNoticed.save();
      res.json({ ok: true });
    } else {
      const newPayload = new noticeModel({
        heading,
        text,
        variant,
        batchId,
        userId: req.user._id,
      });

      await newPayload.save();
      res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const getNotice = async (req, res) => {
  const { batchId } = req.params;
  try {
    const notice = await noticeModel.findOne({ batchId });
    res.json(notice);
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  addOrUpdateNotice,
  getNotice,
};
