const Course = require("../models/course");
const Workshop = require("../models/workshops");
const Enroll = require("../models/enroll");
const Profile = require("../models/profiles");
const User = require("../models/user");
const fs = require("fs");

// const createProfile = async (req, res) => {
//   const { website, location, status, bio, name, social, removeImage } = req.body;

//   if (!name) {
//     return res.json({ error: "Name is required" });
//   }

//   try {
//     const _user = await User.findById({ _id: req.user._id });
//     if (!_user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     let profile = await Profile.findOne({ user: req.user._id });

//     if (!profile) {
//       profile = new Profile({
//         user: req.user._id,
//       });
//     }

//     // Update fields
//     _user.name = name !== "" ? name : _user.name;
//     profile.website = website;
//     profile.location = location;
//     profile.status = status;
//     profile.bio = bio;
//     profile.social = social || {};

//     if (req?.file?.path) {
//       if (_user.image && _user.image.url) {
//         fs.unlinkSync(_user.image.url); // Delete the previous image
//       }
//       _user.image = {
//         url: req.file.path,
//       };
//     } else if (removeImage) {
//       if (_user.image && _user.image.url) {
//         fs.unlinkSync(_user.image.url); // Delete the image
//       }
//       _user.image = null; // Set the image field to null or undefined
//     }

//     await _user.save();
//     await profile.save();

//     const action = profile.isNew ? "created" : "updated"; // Use Mongoose's isNew property to determine if the document was just created
//     return res.json({ ok: true, message: `Profile ${action} successfully`, name: _user.name, image: _user.image });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Server Error" });
//   }
// };

const createProfile = async (req, res) => {
  const { website, location, status, bio, name, social } = req.body;

  if (!name) {
    return res.json({ error: "Name is required" });
  }

  try {
    const _user = await User.findById({ _id: req.user._id });
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    const profile = new Profile({
      user: req.user._id,
      website,
      location,
      status,
      bio,
      social: social || {},
    });

    if (req?.file?.path) {
      _user.image = {
        url: req.file.path,
      };
    }

    await _user.save();
    await profile.save();

    return res.json({ ok: true, message: "Profile created successfully", name: _user.name, image: _user.image });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  const { website, location, status, bio, name, social, removeImage } = req.body;

  if (!name) {
    return res.json({ error: "Name is required" });
  }

  try {
    const _user = await User.findById({ _id: req.user._id });
    if (!_user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Update fields
    _user.name = name !== "" ? name : _user.name;
    profile.website = website;
    profile.location = location;
    profile.status = status;
    profile.bio = bio;
    profile.social = social || {};

    if (req?.file?.path) {
      if (_user.image && _user.image.url) {
        fs.unlinkSync(_user.image.url); // Delete the previous image
      }
      _user.image = {
        url: req.file.path,
      };
    } else if (removeImage) {
      if (_user.image && _user.image.url) {
        fs.unlinkSync(_user.image.url); // Delete the image
      }
      _user.image = null; // Set the image field to null or undefined
    }

    await _user.save();
    await profile.save();

    return res.json({ ok: true, message: "Profile updated successfully", name: _user.name, image: _user.image });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const addEnrollmentInfo = async (req, res) => {
  const { enrollmentInfo } = req.body;

  const { phoneNumber, whatsAppphoneNumber, dateOfBirth, gender, idCard, address, city, parentName, parentOccupations, parentPhoneNumber, interest, wantToAchieve } =
    enrollmentInfo;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    if (!phoneNumber || !whatsAppphoneNumber || !address || !city || !dateOfBirth || !parentName || !parentOccupations || !gender) {
      return res.json({ error: "All fields are required" });
    }

    // Remove the skill from the profile's skills array
    profile.enrollmentInfo = enrollmentInfo;

    // Save the updated profile
    await profile.save();

    res.json({ ok: true, enrollmentInfo: profile.enrollmentInfo });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const myEnrollmentInfo = async (req, res) => {
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    res.json({ ok: true, enrollmentInfo: profile.enrollmentInfo });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const myProfile = async (req, res) => {
  try {
    const _profile = await Profile.findOne({ user: req.user._id }).populate("user", ["name", "email", "image", "_id"]);

    if (_profile) {
      return res.json({ ok: true, _profile });
    } else {
      return res.json({ ok: false });
    }
  } catch (error) {
    console.log(err);
  }
};

const addingSkills = async (req, res) => {
  try {
    if (!req.body.skill) {
      return res.json({ error: "Skill is required" });
    }
    const profile = await Profile.findOne({ user: req.user._id });
    profile.skills.push(req.body.skill);

    await profile.save();
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const mySkills = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate("user");

    // console.log(profile);

    return res.json({ ok: true, skills: profile.skills });
  } catch (error) {
    console.log(error);
  }
};

const deleteSkill = async (req, res) => {
  const { skillToDelete } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    // Remove the skill from the profile's skills array
    profile.skills = profile.skills.filter((skill) => skill !== skillToDelete);

    // Save the updated profile
    await profile.save();

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const myEducation = async (req, res) => {
  const { school, degree, to, from, current, descriprtion } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    res.json({ ok: true, education: profile.education });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addEducation = async (req, res) => {
  const { school, degree, to, from, current, description } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    if (!school || !degree || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }

    // Remove the skill from the profile's skills array
    profile.education.unshift(req.body);

    // Save the updated profile
    await profile.save();

    res.json({ ok: true, education: profile.education });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteEducation = async (req, res) => {
  const { _id } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    if (!_id) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    // Remove the skill from the profile's skills array
    const removeIndex = profile.education.map((item) => item.id).indexOf(_id);
    if (removeIndex === -1) {
      throw new Error("Education entry not found");
    }

    // Remove the education entry from the profile's education array
    profile.education.splice(removeIndex, 1);

    // Save the updated profile
    await profile.save();

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateEducation = async (req, res) => {
  const { _id, school, degree, to, from, current, description } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      throw new Error("Profile not found");
    }

    if (!school || !degree || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }

    // Find the index of the education entry to update
    const updateIndex = profile.education.map((item) => item.id).indexOf(_id);
    if (updateIndex === -1) {
      throw new Error("Education entry not found");
    }

    const updatedEducationData = {
      school,
      degree,
      to,
      from,
      current,
      description,
    };

    // Update the education entry in the profile's education array
    profile.education[updateIndex] = updatedEducationData;

    // Save the updated profile
    await profile.save();

    return res.json({ ok: true, profile });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// my experience functions

const myExp = async (req, res) => {
  const { school, degree, to, from, current, descriprtion } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    res.json({ ok: true, experience: profile.experience });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addExp = async (req, res) => {
  const { title, to, from, current, typeOfJob, skills, location, company } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    if (!title || !typeOfJob || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }

    // Remove the skill from the profile's skills array
    profile.experience.unshift(req.body);

    // Save the updated profile
    await profile.save();

    res.json({ ok: true, experience: profile.experience });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteExp = async (req, res) => {
  const { _id } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    if (!_id) {
      return res.status(404).json({ error: "Profile is not find" });
    }

    // Remove the skill from the profile's skills array
    const removeIndex = profile.experience.map((item) => item.id).indexOf(_id);
    if (removeIndex === -1) {
      throw new Error("Experience entry not found");
    }

    // Remove the education entry from the profile's education array
    profile.experience.splice(removeIndex, 1);

    // Save the updated profile
    await profile.save();

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateExp = async (req, res) => {
  const { _id, title, to, from, current, typeOfJob, skills, location, company } = req.body;
  try {
    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      throw new Error("Profile not found");
    }

    if (!title || !typeOfJob || !from || !skills || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }

    // Find the index of the education entry to update
    const updateIndex = profile.experience.map((item) => item.id).indexOf(_id);
    if (updateIndex === -1) {
      throw new Error("Experience entry not found");
    }

    const updatedExpData = {
      title,
      to,
      from,
      current,
      typeOfJob,
      skills,
      location,
      company,
    };

    // Update the education entry in the profile's education array
    profile.experience[updateIndex] = updatedExpData;

    // Save the updated profile
    await profile.save();

    return res.json({ ok: true, profile });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// certificates
const myCertificates = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ ok: true, certificates: profile.certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const addCertificate = async (req, res) => {
  const { title, platform, from, to, current } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    if (!title || !platform || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }
    profile.certificates.unshift(req.body);
    await profile.save();
    res.json({ ok: true, certificates: profile.certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCertificate = async (req, res) => {
  const { _id } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const removeIndex = profile.certificates.map((item) => item.id).indexOf(_id);
    if (removeIndex === -1) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    profile.certificates.splice(removeIndex, 1);
    await profile.save();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateCertificate = async (req, res) => {
  const { _id, title, platform, from, to, current } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    if (!title || !platform || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }
    const updateIndex = profile.certificates.map((item) => item.id).indexOf(_id);
    if (updateIndex === -1) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    const updatedCertificateData = {
      title,
      platform,
      from,
      to,
      current,
    };
    profile.certificates[updateIndex] = updatedCertificateData;
    await profile.save();
    res.json({ ok: true, certificates: profile.certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// certificates
const myPortfolio = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ ok: true, portfolio: profile.portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const addProject = async (req, res) => {
  const { title, link, from, to, current, description } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    if (!title || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }
    profile.portfolio.unshift(req.body);
    await profile.save();
    res.json({ ok: true, portfolio: profile.portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProject = async (req, res) => {
  const { _id } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const removeIndex = profile.portfolio.map((item) => item.id).indexOf(_id);
    if (removeIndex === -1) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    profile.portfolio.splice(removeIndex, 1);
    await profile.save();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updatePortfolio = async (req, res) => {
  const { _id, title, link, from, to, current, description } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    if (!title || !link || !from || !(to || current)) {
      return res.json({ error: "All fields are required" });
    }
    const updateIndex = profile.portfolio.map((item) => item.id).indexOf(_id);
    if (updateIndex === -1) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    const updatedData = {
      title,
      link,
      from,
      to,
      current,
      description,
    };
    profile.portfolio[updateIndex] = updatedData;
    await profile.save();
    res.json({ ok: true, portfolio: profile.portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const publicEnable = async (req, res) => {
  const { public } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate({ user: req.user._id }, { public: public }, { new: true });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const profilePrivacy = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ ok: true, public: profile.public });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const publicProfiles = async (req, res) => {
  try {
    const { term } = req.query;

    // Search by user's name or email
    const users = await User.find({
      $or: [{ name: new RegExp(term, "i") }, { email: new RegExp(term, "i") }],
    });

    const userIds = users.map((user) => user._id);

    // Search profiles by skills, user's name, or user's email
    const profiles = await Profile.find({ public: true, $or: [{ user: { $in: userIds } }, { skills: new RegExp(term, "i") }] }).populate("user", [
      "name",
      "email",
      "role",
      "image",
    ]); // Populate user details

    res.json({ profiles });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const publicProfileDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Search profiles by skills, user's name, or user's email
    const profile = await Profile.findById({
      _id: id,
    }).populate("user", ["name", "email", "role", "image"]);

    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const myEnrollments = async (req, res) => {
  try {
    const _user = await User.findById(req.user._id);
    if (!_user) {
      return res.json({ error: "User is not found." });
    }

    let _enrollments = await Enroll.find({ email: _user.email });
    _enrollments = await Promise.all(
      _enrollments.map(async (enrollment) => {
        let courseDetails = {};
        let workshopDetails = {};

        if (enrollment.course) {
          courseDetails = await Course.findOne({ slug: enrollment.course }).populate("image");
        }

        if (enrollment.workshop) {
          workshopDetails = await Workshop.findOne({ slug: enrollment.workshop }).populate("image");
        }

        return {
          ...enrollment._doc,
          course: courseDetails,
          workshop: workshopDetails,
        };
      })
    );

    return res.json(_enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createProfile,
  myProfile,
  addingSkills,
  mySkills,
  deleteSkill,
  addEducation,
  myEducation,
  deleteEducation,
  updateEducation,

  addExp,
  updateExp,
  deleteExp,
  myExp,

  myCertificates,
  addCertificate,
  deleteCertificate,
  updateCertificate,

  myPortfolio,
  addProject,
  deleteProject,
  updatePortfolio,
  profilePrivacy,
  publicEnable,
  publicProfiles,
  publicProfileDetail,
  myEnrollments,
  updateProfile,

  addEnrollmentInfo,
  myEnrollmentInfo,
};
