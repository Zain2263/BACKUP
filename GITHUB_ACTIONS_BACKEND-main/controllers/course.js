// blog image removal is here...

const cloudinary = require("cloudinary");
const slugify = require("slugify");
const Course = require("../models/course");
const user = require("../models/user");
const Gallary = require("../models/gallary");
const Category = require("../models/category");
const cheerio = require("cheerio");
const blog = require("../models/blog");
const course = require("../models/course");
const fs = require("fs");

cloudinary.config({
  cloud_name: "ddwj52jk1",
  api_key: "612664661875291",
  api_secret: "iO9cuKSSNcP2BxYh0NJAyD_px-o",
});

const uploadImage = async (req, res) => {
  try {
    // console.log(req.body, "here is from image");

    const result = await cloudinary.uploader.upload(req.files.image.path);
    const media = await new Gallary({
      url: result.secure_url,
      public_id: result.public_id,
      postedBy: req.user._id,
    }).save();

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.body.filepath);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

const removeImage = async (req, res) => {
  try {
    const findedCourse = await Course.findById({ _id: req.params.courseId });
    findedCourse.image = {};
    await findedCourse.save();
    const result = await cloudinary.uploader.destroy(req.body.filepath);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

const createCourse = async (req, res) => {
  const {
    title,
    overview,
    lectures,
    faqs,
    whyUs,
    prerequisites,
    benefits,
    marketValue,
    courseFor,
    duration,
    classes,
    timming,
    startingFrom,
    regFee,
    courseFee,
    instructor,
    categories,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    seoTitle,
    metaDescription,
  } = req.body;
  try {
    console.log({
      title,
      overview,
      lectures,
      faqs,
      whyUs,
      prerequisites,
      benefits,
      marketValue,
      courseFor,
      duration,
      classes,
      timming,
      startingFrom,
      regFee,
      courseFee,
      instructor,
      categories,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      seoTitle,
      metaDescription,
    });

    if (
      !title ||
      !overview ||
      !lectures ||
      !faqs ||
      !whyUs ||
      !prerequisites ||
      !benefits ||
      !marketValue ||
      !courseFor ||
      !duration ||
      !classes ||
      !timming ||
      !startingFrom ||
      !regFee ||
      !courseFee ||
      !instructor ||
      !categories ||
      !seoTitle ||
      !metaDescription
    ) {
      return res.status(400).json({ error: "All fields are requried**" });
    }

    const alreadyExist = await Course.findOne({
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

    setTimeout(async () => {
      const dataIsGoingToSaved = await new Course({
        ...req.body,
        image: {
          url: req.file ? req.file.path : undefined,
        },
        slug: slugify(title),
        categories: ids,
        postedBy: req.user._id,
      }).save();
      return res.json({ course: dataIsGoingToSaved });
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }).populate("instructor").populate("categories", "_id name slug");
    let list = courses.map((course) => {
      const $ = cheerio.load(course.overview);
      const plainText = $.text();

      return {
        ...course,
        plainOverview: plainText,
      };
    });

    return res.json({ courses: list });
    // return res.json({ courses });
  } catch (err) {
    console.log(err);
  }
};

// same as above but here we ar selecting some things just
const allCourses2 = async (req, res) => {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .select("image title _id slug duration classes show2 regFee")
      .populate("instructor", "name");

    return res.json({ courses });
    // return res.json({ courses });
  } catch (err) {
    console.log(err);
  }
};

const allCoursesForForm = async (req, res) => {
  try {
    const courses = await Course.find({ show: true }).select("title slug _id image courseFee");
    return res.json({ courses });
  } catch (err) {
    console.log(err);
  }
};

const courseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate("instructor").populate("categories", "_id name slug");

    return res.json({ course });
  } catch (err) {
    console.log(err);
  }
};

const singleCourse = async (req, res) => {
  try {
    // console.log("touched");
    const course = await Course.findOne({ _id: req.params.id }).populate("categories", "_id name slug");
    // console.log("touched", course);
    return res.json(course);
  } catch (err) {
    console.log(err);
  }
};

const EditCourse = async (req, res) => {
  const {
    title,
    overview,
    lectures,
    faqs,
    whyUs,
    prerequisites,
    benefits,
    marketValue,
    courseFor,
    duration,
    classes,
    timming,
    startingFrom,
    regFee,
    courseFee,
    image,
    instructor,
    categories,
    seoTitle,
    metaDescription,
  } = req.body;

  console.log(
    {
      title,
      overview,
      lectures,
      faqs,
      whyUs,
      prerequisites,
      benefits,
      marketValue,
      courseFor,
      duration,
      classes,
      timming,
      startingFrom,
      regFee,
      courseFee,
      image,
      instructor,
      categories,
      metaDescription,
      seoTitle,
    },
    "from body"
  );

  try {
    if (
      !title ||
      !overview ||
      !lectures ||
      !faqs ||
      !whyUs ||
      !prerequisites ||
      !benefits ||
      !marketValue ||
      !courseFor ||
      !duration ||
      !classes ||
      !timming ||
      !startingFrom ||
      !regFee ||
      !courseFee ||
      !categories ||
      !seoTitle ||
      !metaDescription
    ) {
      return res.status(400).json({ error: "All fields are requried**" });
    }

    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({ name: categories[i] });
      ids.push(cat._id);
    }

    const existingCourse = await Course.findById({ _id: req.params.id });

    if (req.file && existingCourse.image && existingCourse.image.url) {
      fs.unlink(existingCourse.image.url, (err) => {
        if (err) console.error(`Error deleting file: ${existingCourse.image.url}`, err);
      });
    }

    const payloadData = {
      ...req.body,
      slug: slugify(title),
      categories: ids,
      postedBy: req.user._id,
      image: {
        url: req.file ? req.file.path : existingCourse.image.url,
      },
    };

    setTimeout(async () => {
      const dataIsGoingToSaved = await Course.findByIdAndUpdate({ _id: req.params.id }, payloadData, { new: true });
      return res.json({ course: dataIsGoingToSaved });
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const DeleteCourse = async (req, res) => {
  try {
    const dataIsGoingToSaved = await Course.findOneAndRemove({
      _id: req.params.id,
    });

    return res.json({ course: dataIsGoingToSaved });
  } catch (err) {
    console.log(err);
  }
};

const gettingAllInstructors = async (req, res) => {
  try {
    const instructors = await user.find({ role: "instructor" });
    res.json(instructors);
  } catch (error) {
    console.log(err);
  }
};

const disableAnCourse = async (req, res) => {
  const { showOrNot } = req.body;
  try {
    const course = await Course.findByIdAndUpdate({ _id: req.params.id }, { show: showOrNot }, { new: true });
    return res.json({ ok: true });
  } catch (error) {
    console.log(err);
  }
};

const disableAnCourseFromPage = async (req, res) => {
  const { showOrNot } = req.body;
  try {
    const course = await Course.findByIdAndUpdate({ _id: req.params.id }, { show2: showOrNot }, { new: true });
    return res.json({ ok: true });
  } catch (error) {
    console.log(err);
  }
};

module.exports = {
  uploadImage,
  removeImage,
  createCourse,
  allCourses,
  singleCourse,
  EditCourse,
  DeleteCourse,
  courseBySlug,
  gettingAllInstructors,
  deleteImage,
  allCoursesForForm,
  // removeImageOfBlog,
  disableAnCourse,
  disableAnCourseFromPage,
  allCourses2,
};
