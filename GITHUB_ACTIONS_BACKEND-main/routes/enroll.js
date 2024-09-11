const express = require("express");
const router = express.Router();
const Enroll = require("../models/enroll");
const nodemailer = require("nodemailer");
const { SendEmail, freeCourseConfirmations, workshopConfirmations, advanceCourseConfirmations } = require("../helpers/SendEmail");
const { reqSignIn, lmsRights } = require("../middlewares/auth");
const { validateEnollments } = require("../helpers/Validations");

const slugToTitle = (slug) => {
  const words = slug.split("-");
  const titleCaseWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return titleCaseWords.join(" ");
};

router.post("/enroll-stu", async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    phoneNumber,
    idCard,
    address,
    city,
    dateOfBirth,
    parentName,
    parentOccupations,
    parentPhoneNumber,
    interest,
    wantToAchieve,
    gender,
    course,
    workshop,
    education,
    enrollTo,
    link,
    passcodeId,
    meetingId,
    meetingTiming,
    heading,
    authorName,
    whatsAppphoneNumber,
    policyAccepted,
    testLink,
  } = req.body;

  try {
    const errors = validateEnollments(req.body);
    if (errors) {
      return res.status(422).json({ message: errors.join(", ") });
    }

    const dataToBeSaved = {
      firstName,
      lastName,
      email,
      phoneNumber,
      whatsAppphoneNumber,
      idCard,
      address,
      city,
      dateOfBirth,
      parentName,
      parentOccupations,
      parentPhoneNumber,
      interest,
      wantToAchieve,
      gender,
      course,
      workshop,
      education,
      enrollTo,
      policyAccepted,
      isPaid: false,
      approved: false,
      registered: false,
      rejected: false,
    };

    const newStuApp = new Enroll(dataToBeSaved);

    const createdStu = await newStuApp.save();

    let transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "092278222233a30ae8ce3672f768853b",
      },
    });

    if (course && !testLink) {
      advanceCourseConfirmations(course, email);
    }

    if (course && testLink) {
      freeCourseConfirmations(course, email, firstName, testLink);
    }

    if (workshop && !course) {
      console.log("hi");
      let data = { heading, firstName, meetingTiming, authorName, link, meetingId, passcodeId };
      workshopConfirmations(data, email);
    }

    transporter.sendMail(
      {
        from: '"Info" <info@hadielearning.com>',
        to: "hadielearningofficial@gmail.com",
        subject: `Application submitted by ${firstName} ${lastName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Simple HTML Email</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <h2>Form Submitted by ${firstName} ${lastName}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>CNIC:</strong> ${idCard}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Date of birth:</strong> ${dateOfBirth}</p>
          <p><strong>Education:</strong> ${education}</p>
          <br/>
          <p><strong>Father Name:</strong> ${parentName}</p>
          <p><strong>Father Occupations:</strong> ${parentOccupations}</p>
          <p><strong>Father Phone:</strong> ${parentPhoneNumber}</p>
          <br/>
          <p><strong>Interst:</strong> ${interest}</p>
          <p><strong>Want to achieve:</strong> ${wantToAchieve}</p>
          <br/>
          <p><strong>Want to enoll ${enrollTo}:</strong> ${enrollTo === "program" ? course : ""} ${
          enrollTo === "workshop" ? workshop : ""
        }</p>
          
        </body>
        </html>
        `,
      },
      (error, info) => {
        if (error) {
          console.log(error, "email");
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );

    res.status(200).json({
      message: "Your Application has been sent",
      createdStu,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.get("/fetch_rejected", async (req, res) => {
  try {
    console.log(req.body.admin, "adminss");
    const allData = await Enroll.find({ approved: false, rejected: true });
    // console.log(allData)
    res.status(200).json({
      message: "Your Application has been sent",
      allApplications: allData,
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.put("/update_stu", async (req, res) => {
  try {
    const updated = await Enroll.findById({ _id: req.body.userID });
    updated.approved = true;
    await updated.save();
    // console.log("clicked");
    res.status(200).json({
      message: "updated",
      updated: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: error.message,
    });
  }
});

router.put("/reject_stu", async (req, res) => {
  try {
    const updated = await Enroll.findById({ _id: req.body.userID });
    updated.rejected = true;
    await updated.save();
    console.log("clicked");
    res.status(200).json({
      message: "updated",
      updated: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error_code: "student_applications",
      message: error.message,
    });
  }
});

router.get("/workshops", async (req, res) => {
  try {
    const allData = await Enroll.find({
      enrollTo: "workshop",
      approved: false,
      rejected: false,
    }).sort({ createdAt: -1 });
    // console.log(allData)
    res.status(200).json({
      message: "Your Application has been sent",
      workshops: allData,
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.get("/programs", async (req, res) => {
  try {
    const allData = await Enroll.find({
      enrollTo: "program",
      approved: false,
      rejected: false,
    }).sort({ createdAt: -1 });
    // console.log(allData)
    res.status(200).json({
      message: "Your Application has been sent",
      programs: allData,
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.get("/user/:email", async (req, res) => {
  // console.log(req.params.email);
  try {
    const data = await Enroll.findOne({
      email: req.params.email,
      rejected: false,
    });
    // console.log("finded user user by email", data);
    res.status(200).json({
      message: "Your Application has been sent",
      user: data,
      finded: data ? true : false,
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      error_code: "Fetching Singal User",
      message: e.message,
    });
  }
});

// router.post("/sendmails", async (req, res) => {
//   try {
//     var transport = nodemailer.createTransport({
//       host: "live.smtp.mailtrap.io",
//       port: 587,
//       auth: {
//         user: "api",
//         pass: "092278222233a30ae8ce3672f768853b",
//       },
//     });

//     var mailOptions = {
//       from: '"Info" <info@hadielearning.com>',
//       to: "hadistructures@gmail.com",
//       subject: "Nice Nodemailer test",
//       text: "Hey HADI there, it’s our first message sent with Nodemailer ",
//       html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
//     };
//     transport.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.log(error);
//       }
//       console.log("Message sent: %s", info.messageId);
//     });
//   } catch (error) {
//     console.log(e);
//     res.status(400).json({
//       error_code: "Fetching Singal User",
//       message: e.message,
//     });
//   }
// });

router.get("/fetch_data", reqSignIn, lmsRights, async (req, res) => {
  try {
    const allData = await Enroll.find({
      approved: false,
      rejected: false,
    }).sort({ createdAt: -1 });
    // console.log(allData)
    res.status(200).json({
      message: "Your Application has been sent",
      allApplications: allData,
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      error_code: "student_applicationsD",
      message: e.message,
    });
  }
});

router.get("/fetch/enrollments", reqSignIn, lmsRights, async (req, res) => {
  const { enrollTo, course, workshop, fromDate, endDate, search, page = 1, limit = 10, todays } = req.query;

  const query = {
    enrollTo: enrollTo || { $in: ["workshop", "program"] }, // If enrollTo is not provided, fetch both courses and programs

    $or: [
      { firstName: new RegExp(search, "i") },
      { lastName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phoneNumber: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
    ],
  };

  if (enrollTo === "program") {
    query.course = course || { $exists: true }; // Fetch enrollments with a specific course if provided, or any course if not provided
  } else if (enrollTo === "workshop") {
    query.workshop = workshop || { $exists: true }; // Fetch enrollments with a specific course if provided, or any course if not provided
  }

  if (fromDate && endDate && fromDate === endDate) {
    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    query.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  } else {
    query.createdAt = {
      $gte: fromDate || new Date(0),
      $lte: endDate || new Date(),
    };
  }

  if (todays === "yes") {
    const today = new Date();
    const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0));
    query.createdAt = { $gte: startOfDayUTC, $lt: endOfDayUTC };
  }

  const options = {
    skip: (page - 1) * limit,
    limit: limit,
  };

  try {
    const enrollments = await Enroll.find(query, null, options).sort({
      createdAt: -1,
    });

    const total = await Enroll.countDocuments(query, null, options).exec();
    const totalPages = Math.ceil(total / limit);
    res.json({ enrollments, totalPages, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/fetch/todays", reqSignIn, lmsRights, async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0));

    // Query to find enrollments for today
    const todaysEnrollments = await Enroll.find({
      createdAt: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    });
    // console.log(todaysEnrollments, "hereis");

    res.json({ enrollments: todaysEnrollments });
  } catch (error) {
    console.error("Error fetching today's enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// enrollments by each day
router.get("/fetch/enrollments/per/day", reqSignIn, lmsRights, async (req, res) => {
  try {
    const enrollmentsData = await Enroll.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day",
          count: 1,
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$year",
                  month: "$month",
                  day: "$day",
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);

    res.json(enrollmentsData);
  } catch (error) {
    console.log(error);
  }
});

// enrollment by gender vise
router.get("/by-gender", reqSignIn, lmsRights, async (req, res) => {
  try {
    const enrollmentsByGender = await Enroll.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ genderData: enrollmentsByGender });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// enrollment by course vise
router.get("/by-course", reqSignIn, lmsRights, async (req, res) => {
  try {
    const courseData = await Enroll.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $project: { _id: 0, course: "$_id", count: 1 } },
    ]);

    res.status(200).json({ courseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/by-cities", reqSignIn, lmsRights, async (req, res) => {
  const normalizeCityName = (city) => {
    const cityMappings = {
      karachi: "Karachi",
      khi: "Karachi",
      lahore: "Lahore",
      lhr: "Lahore",
      // add other mappings as needed
    };

    const lowerCaseCity = city.toLowerCase();
    return cityMappings[lowerCaseCity] || city;
  };

  const processEnrollments = (enrollments) => {
    const countByCity = {};

    enrollments.forEach((enrollment) => {
      const normalizedCity = normalizeCityName(enrollment.city);
      countByCity[normalizedCity] = (countByCity[normalizedCity] || 0) + 1;
    });

    return Object.entries(countByCity).map(([city, count]) => ({ city, count }));
  };

  try {
    const enrollments = await Enroll.find({}, "city"); // Fetch only the 'city' field
    const processedData = processEnrollments(enrollments);
    processedData.sort((a, b) => b.count - a.count); // Sort by count in descending order
    res.status(200).json({ processedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
