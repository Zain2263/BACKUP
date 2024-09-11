const multer = require("multer");
const fs = require("fs");

if (!fs.existsSync("assignmentFiles")) {
  fs.mkdirSync("assignmentFiles");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assignmentFiles/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const AssignmentUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /pdf|js|docs|jsx|json|jpg|png|pptx|xlsx|txt/;
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  },
});

module.exports = AssignmentUpload;
