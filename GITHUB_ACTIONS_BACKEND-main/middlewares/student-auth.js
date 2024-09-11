const User = require("../models/user");

const StuHasBatch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.enrolledBatches.includes(req.params.batchId)) {
      next();
    } else {
      res.json({ error: "Havent any batch" });
    }
  } catch (err) {
    console.log(err);
  }
};

const isStu = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    switch (user.role) {
      case "student":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { StuHasBatch, isStu };
