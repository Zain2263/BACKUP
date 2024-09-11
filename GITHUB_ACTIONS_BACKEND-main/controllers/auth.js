const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const { generateOTP, sendEmailForOTP } = require("../helpers/SendEmail");
const fs = require("fs");
const path = require("path");

// not sending
const Register = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  // validation
  if (!name) {
    return res.json({ error: "Name is required" });
  } else if (!role) {
    return res.json({ error: "Role is required" });
  } else if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 charactor long",
    });
  }

  const exist = await User.findOne({ email });

  if (exist) {
    return res.json({ error: "Email is taken" });
  }

  // hashing the password
  const hashed = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashed,
    role,
    status,
  });

  try {
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log("failed error", err);
    res.status(500).json({ err: "Error, Try again" });
  }
};

// not sending any data
const RegisterSimpleStudent = async (req, res) => {
  const { name, email, password } = req.body;

  // validation
  if (!name) {
    return res.json({ error: "Name is required" });
  } else if (!email) {
    return res.json({ error: "Email is required" });
  } else if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 charactor long",
    });
  }

  const exist = await User.findOne({ email });

  if (exist) {
    return res.json({ error: "Email is taken" });
  }

  // hashing the password
  const hashed = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashed,
    role: "student",
  });

  try {
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log("failed error", err);
    res.status(500).json({ err: "Error, Try again" });
  }
};

// sending - data
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ error: "Credential are requried" });
    }

    let user = await User.findOne({ email }).populate("image", "_id url public_id").populate("assignedBatches", "_id title");
    if (!user) return res.json({ error: "No user found" });

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.json({ error: "Credentials are not correct" });

    // create a signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });

    user.password = undefined;
    user.passwordResetOTP = undefined;
    user.passwordResetExpiry = undefined;

    if (user.role === "instructor") {
      user.enrolledBatches = undefined;
      user.completedBatches = undefined;
      user.payments = undefined;
      user.certifications = undefined;
      user.unAssignedCount = undefined;
    } else if (user.role === "cord") {
      user.enrolledBatches = undefined;
      user.completedBatches = undefined;
      user.assignedBatches = undefined;
      user.payments = undefined;
      user.certifications = undefined;
      user.unAssignedCount = undefined;
    } else if (user.role === "student") {
      user.assignedBatches = undefined;
      user.unAssignedCount = undefined;
      user.payments = undefined;
    }

    res.json({ user, token });
  } catch (error) {
    console.log("failed error", error);
    res.status(500).json({ error: "Error, Try again" });
  }
};

// not sendi

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("image", "url public_id");
    if (!user) {
      return res.json({ error: "Not found" });
    }

    res.json({ ok: true });
  } catch (error) {
    console.log("failed error", error);
    res.status(500).json({ error: "Error, Try again" });
  }
};

// sending
const UpdateUser = async (req, res) => {
  try {
    const data = {};

    if (req.body.name) {
      data.name = req.body.name;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: "password required & should be minimum 6 chr long",
        });
      } else {
        data.password = await hashPassword(req.body.password);
      }
    }

    if (req.body.role) {
      data.role = req.body.role;
    }

    if (req.body.status) {
      data.status = req.body.status;
    }

    let user = await userModels.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    user.password = undefined;
    user.role = undefined;
    user.passwordResetOTP = undefined;
    user.passwordResetExpiry = undefined;
    user.enrolledBatches = undefined;
    user.completedBatches = undefined;
    user.payments = undefined;
    user.certifications = undefined;
    user.unAssignedCount = undefined;
    user.assignedBatches = undefined;

    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ error: "Duplicate error" });
    }
    console.log("failed error", error);
  }
};

// get user by id
// sending
const GetUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password -secret -passwordResetOTP -passwordResetExpiry ");
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// sending
const GetAllUsers = async (req, res) => {
  //   console.log(req.body.blocked, "from getting all users");
  try {
    const users = await User.find().select("-password -secret -passwordResetOTP -passwordResetExpiry");
    res.json({ users });
  } catch (error) {
    console.log(error);
  }
};

const DeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

// sending
const updateUserByAdmin = async (req, res) => {
  try {
    const { id, name, email, password, status, role, image, exp } = req.body;

    // console.log(req.body);
    const userFromDb = await User.findById(id);

    // check password length
    if (password && password.length < 6) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name || userFromDb.name,
        email: email || userFromDb.email,
        password: hashedPassword || userFromDb.password,
        status: status || userFromDb.status,
        role: role || userFromDb.role,
        image: {
          url: req?.file?.path ? req?.file?.path : userFromDb?.image?.url !== "" ? userFromDb?.image?.url : "",
        },
        exp: exp || userFromDb.exp,
      },
      { new: true }
    ).populate("image");
    updated.password = undefined;
    unAssignedCount = undefined;
    completedBatches = undefined;
    assignedBatches = undefined;
    payments = undefined;
    certifications = undefined;
    enrolledBatches = undefined;

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

// sending
const updateUserByUser = async (req, res) => {
  try {
    const { id, name, email, password, status, exp } = req.body;

    const userFromDb = await User.findById(id);

    // check if user is himself/herself
    if (userFromDb._id.toString() !== req.user._id.toString()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).send("You are not allowed to update this user");
    }

    // check password length
    if (password && password.length < 6) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name || userFromDb.name,
        email: email || userFromDb.email,
        password: hashedPassword || userFromDb.password,
        status: status || userFromDb.status,
        image: {
          url: req?.file?.path ? req?.file?.path : userFromDb?.image?.url !== "" ? userFromDb?.image?.url : "",
        },
        exp: exp || userFromDb.exp,
      },
      { new: true }
    ).populate("image");

    updated.password = undefined;
    unAssignedCount = undefined;
    completedBatches = undefined;
    assignedBatches = undefined;
    payments = undefined;
    certifications = undefined;
    enrolledBatches = undefined;

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

const DeleteUserImage = async (req, res) => {
  try {
    const findedUser = await User.findById(req.user._id);

    // if (findedUser.image.public_id === req.body.filepath) {
    //   findedUser.image = {};
    //   const result = await cloudinary.uploader.destroy(req.body.filepath);
    //   await findedUser.save();
    //   res.json(result);
    // }
    console.log(findedUser, "here is ");

    const imagePath = path.join(__dirname, "..", findedUser.image.url);

    return;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      findedUser.image = {};
      await findedUser.save();
    }

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const DeleteUserImageByAdmin = async (req, res) => {
  try {
    const findedUser = await User.findById({ _id: req.body._id });

    // if (findedUser.image.public_id === req.body.filepath) {
    //   findedUser.image = {};
    //   const result = await cloudinary.uploader.destroy(req.body.filepath);
    //   await findedUser.save();
    //   res.json(result);
    // }

    const imagePath = path.join(__dirname, "..", findedUser.image.url);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      findedUser.image = {};
      await findedUser.save();
    }

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const allStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Create the search filter if the search parameter is provided
    const searchFilter = {
      role: "student",
      name: { $regex: new RegExp(search, "i") },
    };

    // Calculate the number of users to skip based on the current page and limit
    const skipUsers = (page - 1) * limit;

    // Retrieve the paginated and filtered users
    const users = await User.find(searchFilter)
      .populate("enrolledBatches", "_id title ")
      .populate("completedBatches", "_id title")
      .populate("certifications", "batch", "_id title")
      .select("-password")
      .skip(skipUsers)
      .limit(parseInt(limit))
      .exec();

    // Get the total count of users for pagination
    const totalUsers = await User.countDocuments(searchFilter).exec();

    // Calculate the total pages based on the limit
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the response with the users, total count, current page, and total pages
    return res.status(200).json({
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const allTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Create the search filter if the search parameter is provided
    const searchFilter = {
      role: "instructor",
      name: { $regex: new RegExp(search, "i") },
    };

    // Calculate the number of users to skip based on the current page and limit
    const skipUsers = (page - 1) * limit;

    // Retrieve the paginated and filtered users
    const users = await User.find(searchFilter).populate("assignedBatches", "_id title ").select("-password").skip(skipUsers).limit(parseInt(limit)).exec();

    // Get the total count of users for pagination
    const totalUsers = await User.countDocuments(searchFilter).exec();

    // Calculate the total pages based on the limit
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the response with the users, total count, current page, and total pages
    return res.status(200).json({
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const enrollStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const searchFilter = {
      role: "student",
      $and: [
        { enrolledBatches: { $exists: true } },
        {
          $or: [{ enrolledBatches: { $size: 1 } }, { enrolledBatches: { $size: 2 } }],
        },
      ],
      name: { $regex: new RegExp(search, "i") },
    };

    const skipUsers = (page - 1) * limit;

    const users = await User.find(searchFilter)
      .populate("enrolledBatches", "_id title ")
      .populate("completedBatches", "_id title")
      .populate("certifications", "batch", "_id title")
      .select("-password")
      .skip(skipUsers)
      .limit(parseInt(limit))
      .exec();

    // Get the total count of users for pagination
    const totalUsers = await User.countDocuments(searchFilter).exec();

    // Calculate the total pages based on the limit
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the response with the users, total count, current page, and total pages
    return res.status(200).json({
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const requestForPorgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists with the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email." });
    }

    // Generate a new OTP and save it to the user's document
    const otp = generateOTP();
    user.passwordResetOTP = otp;
    user.passwordResetExpiry = Date.now() + 5 * 60 * 1000; // Set OTP expiry time to 2 minutes
    await user.save();

    // Send the OTP to the user's email
    sendEmailForOTP(email, otp);

    res.json({
      message: "An email with the verification code has been sent to your email address.",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    // res.json({ dummy: user });

    if (!user || user.passwordResetOTP !== otp || user.passwordResetExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP or OTP has expired." });
    }

    user.password = await hashPassword(newPassword);
    user.passwordResetOTP = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    res.json({
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {}
};

module.exports = {
  Register,
  Login,
  UpdateUser,
  GetUser,
  currentUser,
  GetAllUsers,
  DeleteUser,
  updateUserByUser,
  updateUserByAdmin,
  DeleteUserImage,
  allStudents,
  allTeachers,
  enrollStudents,
  requestForPorgetPassword,
  resetPassword,
  RegisterSimpleStudent,
  DeleteUserImageByAdmin,
};
