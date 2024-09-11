const multer = require("multer");
const fs = require("fs");

if (!fs.existsSync("courseImages")) {
  fs.mkdirSync("courseImages");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "courseImages/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const courseImagesUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1, // limiting files size to 2MB
  },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png|webp/;
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  },
});

module.exports = courseImagesUpload;
