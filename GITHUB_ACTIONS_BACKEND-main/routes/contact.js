const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/contact", async (req, res) => {
  let { name, email, message } = req.body;

  try {
    if (name.length < 3) {
      return res.status(422).json({
        message: "Name should be a minimum of three characters long",
      });
    } else if (!email) {
      return res.status(422).json({
        message: "Email is required",
      });
    } else if (message.length < 20) {
      return res.status(422).json({ message: "Please complete your message" });
    }

    const newContact = new Contact({
      name,
      message,
      email,
    });

    const contact = await newContact.save();

    res.status(200).json({
      message: "Your message has been sent",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

module.exports = router;
