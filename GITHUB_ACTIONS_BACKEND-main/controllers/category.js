const Category = require("../models/category");
const slugify = require("slugify");

const create = async (req, res) => {
  // console.log("CATEGORY CREATE CONTROLLER", req.body);
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).send("Duplicate error!");
  }
};

const read = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const update = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(400).send("Update failed");
    console.log(err);
  }
};

const remove = async (req, res) => {
  try {
    // console.log(req.params.slug);
    let category = await Category.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(category);
  } catch (err) {
    res.status(400).send("Delete failed");
    console.log(err);
  }
};

const singleCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
    });
    res.json(category);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

module.exports = {
  create,
  read,
  update,
  remove,
  singleCategory,
};
