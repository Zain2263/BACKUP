const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const express = require("express");
let app = express();

// mongodb connection
const connectDB = require("./BD/db");
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/blogImages", express.static("blogImages"));
app.use("/profileImages", express.static("profileImages"));
app.use("/assetFiles", express.static("assetFiles"));
app.use("/assignmentFiles", express.static("assignmentFiles"));
app.use("/courseImages", express.static("courseImages"));

const enrollRouter = require("./routes/enroll");
const contactRouter = require("./routes/contact");
const userRouter = require("./routes/users");
const comemntRouter = require("./routes/comment");

app.use("/api", enrollRouter);
app.use("/api", contactRouter);
app.use("/api", comemntRouter);
app.use("/api", userRouter);

// console.log("");

// panels apis
const courseRouter = require("./routes/course");
const workshopRouter = require("./routes/workshop");
const categoryRouter = require("./routes/category");
const blogRouter = require("./routes/blog");




app.use("/api", courseRouter);
app.use("/api", workshopRouter);
app.use("/api", categoryRouter);
app.use("/api", blogRouter);

// lms apis
const batchRouter = require("./routes/lms/batch-routes");
const lessonRouter = require("./routes/lms/lesson-routes");
const assetRouter = require("./routes/lms/asset-router");
const folderRouter = require("./routes/lms/folders-router");
const batchCommentsRouter = require("./routes/lms/Btch-coments-router");

// stu routes
const StuRouter = require("./routes/lms/stu-router");
const BatchStats = require("./routes/lms/BatchStats");
const ProfilesRoutes = require("./routes/profiles");
const multer = require("multer");



app.use("/api/lms", batchRouter);
app.use("/api/lms", lessonRouter);
app.use("/api/lms", assetRouter);
app.use("/api/lms", folderRouter);
app.use("/api/lms", batchCommentsRouter);
app.use("/api/lms", StuRouter);
app.use("/api/lms", BatchStats);
app.use("/api", ProfilesRoutes);

console.log("/here is ");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.json({ error: err.message });
  } else if (err) {
    // An unknown error occurred.
    return res.status(500).json({ error: "An error occurred" });
  }
  // Forward the request to the next middleware if no error
  next();
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});

// port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
