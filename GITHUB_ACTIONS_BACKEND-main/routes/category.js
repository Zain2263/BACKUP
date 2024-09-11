const express = require("express");

const router = express.Router();

// controllers
const {
  create,
  read,
  update,
  remove,
  singleCategory,
} = require("../controllers/category");
const { reqSignIn, isAdmin } = require("../middlewares/auth");

router.post("/category", reqSignIn, isAdmin, create);
router.get("/categories", read);
router.put("/category/:slug", reqSignIn, isAdmin, update);
router.delete("/category/:slug", reqSignIn, isAdmin, remove);
router.get("/category/:slug", singleCategory);

module.exports = router;
