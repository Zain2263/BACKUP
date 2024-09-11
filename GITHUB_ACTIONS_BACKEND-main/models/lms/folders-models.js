const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, requried: true },
    batchId: { type: ObjectId, ref: "Batch" },
    createdBy: { type: ObjectId, ref: "User" },
    data: [
      {
        stu_id: { type: ObjectId, ref: "User" },
        file: { type: String, requried: true },
        file_name: { type: String, requried: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
