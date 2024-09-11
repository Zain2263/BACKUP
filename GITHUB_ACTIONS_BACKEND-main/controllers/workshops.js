const slugify = require("slugify");
const Workshops = require("../models/workshops");
const Category = require("../models/category");
const fs = require("fs");
const path = require("path");

const createWorkshop = async (req, res) => {
  const {
    breadTitle,
    title,
    content,
    outlines,

    conclusion,
    dateAndTime,
    instructor,
    zoomLink,
    meetingId,
    pascodeId,
    meetingTiming,
    tags,
    categories,
  } = req.body;
  try {
    if (
      !breadTitle ||
      !title ||
      !content ||
      !outlines ||
      !conclusion ||
      !dateAndTime ||
      !instructor ||
      !zoomLink ||
      !meetingId ||
      !pascodeId ||
      !meetingTiming ||
      !tags ||
      !categories
    ) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "All fields are requried**" });
    }

    const alreadyExist = await Workshops.findOne({
      slug: slugify(title.toLowerCase()),
    });

    if (alreadyExist) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.json({ error: "Title is taken" });
    }

    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({ name: categories[i] });

      ids.push(cat._id);
    }

    let payloadData = {
      breadTitle,
      title,
      content,
      outlines,
      image: {
        url: req.file ? req.file.path : undefined,
      },
      conclusion,
      dateAndTime,
      instructor,
      zoomLink,
      meetingId,
      pascodeId,
      categories: ids,
      meetingTiming,
      slug: slugify(title.toLowerCase()),
      tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => " " + tag.trim()),
    };

    setTimeout(async () => {
      const dataIsGoingToSaved = await new Workshops(payloadData).save();
      return res.json({ workshop: dataIsGoingToSaved });
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const allWorkshops = async (req, res) => {
  try {
    const allworkshops = await Workshops.find({}).sort({ createdAt: -1 }).populate("instructor").populate("categories", "_id name slug");
    return res.json({ allworkshops });
  } catch (err) {
    console.log(err);
  }
};

const workshopBySlug = async (req, res) => {
  try {
    const workshop = await Workshops.findOne({
      slug: req.params.slug,
    })
      .populate("instructor")
      .populate("categories", "_id name slug");

    return res.json({ workshop });
  } catch (err) {
    console.log(err);
  }
};

const singleWorkshop = async (req, res) => {
  try {
    const workshop = await Workshops.findOne({ _id: req.params.id }).populate("categories", "_id name slug");
    return res.json(workshop);
  } catch (err) {
    console.log(err);
  }
};

const EditWorkshop = async (req, res) => {
  const { breadTitle, title, content, outlines, image, conclusion, dateAndTime, instructor, zoomLink, meetingId, pascodeId, meetingTiming, tags, categories } = req.body;

  console.log(
    req.body,

    "from body"
  );

  try {
    if (
      !breadTitle ||
      !title ||
      !content ||
      !outlines ||
      !conclusion ||
      !dateAndTime ||
      !instructor ||
      !zoomLink ||
      !meetingId ||
      !pascodeId ||
      !meetingTiming ||
      !tags ||
      !categories
    ) {
      return res.status(400).json({ error: "All fields are requried**" });
    }

    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({ name: categories[i] });
      // console.log(cat, "indexx", i);
      ids.push(cat._id);
    }

    let payloadData = {
      breadTitle,
      title,
      content,
      outlines,
      image,
      conclusion,
      dateAndTime,
      instructor,
      zoomLink,
      meetingId,
      categories: ids,
      pascodeId,
      meetingTiming,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => " " + tag.trim()),
      slug: slugify(title),
      postedBy: req.user._id,
    };

    setTimeout(async () => {
      const dataIsGoingToSaved = await Workshops.findByIdAndUpdate({ _id: req.params.id }, payloadData, { new: true });

      return res.json(dataIsGoingToSaved);
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const DeleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshops.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    // Delete the image from the server
    const imagePath = path.join(__dirname, "..", workshop.image.url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the workshop from the database
    await Workshops.findByIdAndRemove(req.params.id);

    res.json({ message: "Workshop deleted successfully" });
  } catch (err) {
    console.log(err);
  }
};

const formWorkshops = async (req, res) => {
  try {
    const _workshops = await Workshops.find({ show: true }).select("-image").populate("instructor", "name");
    return res.json({ _workshops });
  } catch (error) {
    console.log(err);
  }
};

const WorkshopsFilters = async (req, res) => {
  try {
    const _workshops = await Workshops.find().select("_id title slug");

    return res.json({ _workshops });
  } catch (error) {
    console.log(err);
  }
};

const disableAnWorkshop = async (req, res) => {
  const { showOrNot } = req.body;
  try {
    const workshop = await Workshops.findByIdAndUpdate({ _id: req.params.id }, { show: showOrNot }, { new: true });
    return res.json({ ok: true });
  } catch (error) {
    console.log(err);
  }
};

module.exports = {
  createWorkshop,
  allWorkshops,
  singleWorkshop,
  EditWorkshop,
  DeleteWorkshop,
  workshopBySlug,
  formWorkshops,
  disableAnWorkshop,
  WorkshopsFilters,
};
