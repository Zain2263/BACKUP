const nodemailder = require("nodemailer");
const crypto = require("crypto");
const slugToTitle = require("./slugToTitle");
const nodemailer = require("nodemailer");

let transporter = nodemailder.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "092278222233a30ae8ce3672f768853b",
  },
});

const SendEmail = (req, res, emailData) => {
  let transporter = nodemailder.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false, // use SSL/TLS
    auth: {
      user: "info@hadielearning.com",
      pass: "alf2nD&b",
    },
  });

  return transporter
    .sendMail(emailData)
    .then((info) => {
      res.json({ msg: "send" });
      console.log(`Message sent: ${info.response}`);
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function sendEmailForOTP(email, otp) {
  const mailOptions = {
    from: "info@hadielearning.com",
    to: email,
    subject: "Password Reset",
    text: `Your verification code is: ${otp}. Please use this code to reset your password.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

const freeCourseConfirmations = (course, email, firstName, testLink) => {
  let CourseTitle = slugToTitle(course);

  const courseEmailData = {
    from: '"Info" <info@hadielearning.com>',
    to: email,
    subject: "Enrollment Received!",
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>🔔 Enrollment Received!</title>
</head>
<body style="background-color: white">
  <table
    cellpadding="0"
    cellspacing="0"
    border="0"
    width="100%"
    bgcolor="#0f3f5d"
    color="white"
  >
    <tr>
      <td style="padding: 20px">
        <h3 style="color: white">Dear ${firstName}</h3>
        <p style="color: white">
          I hope this message finds you in good health.
        </p>
        <p style="color: white">
          I am reaching out from Hadi E-learning, Thank you for showing
          interest in our course ${CourseTitle}
        </p>
        <p style="color: white">
          We invite you to kindly attempt this quiz to secure your place in
          the upcoming course batch. To enroll in this course, you need to
          pass this quiz, so don't miss out on this opportunity. Good luck!
        </p>

        <p style="color: white">
          ${CourseTitle} Quiz Link:
          <a
            href={${testLink}}
            target="_"
            style="color: rgb(68, 148, 253)"
            >${testLink}</a
          >
        </p>
        <p style="color: white">Note:</p>
        <ul>
          <li style="color: white">
            We will accommodate the students who have passed the test on first
            come first basis in our upcoming batches.
          </li>
          <li style="color: white">
            The Participants who are not able to pass in 1st attempt can
            reattempt!
          </li>
        </ul>

        <p style="color: white; margin-top: 30px">
          Thank you for your cooperation.
        </p>
        <p style="color: white; padding-top: 30px">
          Got questions or need assistance? We're here to help!
        </p>
        <p style="color: white">
          Email:
          <a
            href="mailto:info@hadielearning.com"
            target="_"
            style="color: rgb(68, 148, 253)"
            >info@hadielearning.com</a
          >
        </p>
        <p style="color: white">
          WhatsApp:
          <a
            style="color: rgb(68, 148, 253)"
            href="tel:+923111193339"
            target="_"
            >03111193339</a
          >
        </p>

        <p style="color: white; margin-top: 30px">Warm regards,</p>
        <p style="color: white">Hadi E-learning</p>
      </td>
    </tr>
  </table>
</body>
</html> 
 
      `,
  };

  transporter.sendMail(courseEmailData, (error, info) => {
    if (error) {
      console.log(error, "email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const advanceCourseConfirmations = (course, email) => {
  let CourseTitle = slugToTitle(course);

  const courseEmailData = {
    from: '"Info" <info@hadielearning.com>',
    to: email,
    subject: ` Don't Miss Out! Complete Your Enrollment for ${CourseTitle}`,
    html: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Don't Miss Out! Complete Your Enrollment for ${CourseTitle}</title>
      </head>
      <body style="background-color: white">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0f3f5d" color="white">
          <tr>
            <td style="padding: 20px">
              <h3 style="color: white">Welcome Aboard!</h3>
              <p style="color: white">Thank you for your interest in our course, ${CourseTitle} .</p>
              <p style="color: white">You're just one step away from entering the domain of data analysis!</p>
              <p style="color: white">Just a quick reminder to complete your enrollment by paying the registration fee of PKR 10,000/-.</p>
    
              <p style="color: white">This step is super important to get you all set for the course.</p>
              <h3 style="color: white">Please Note:</h3>
              <ul>
                <li style="color: white">Please pay your dues within the course of 3 days to confirm your enrollment.</li>
              </ul>
    
              <h3 style="color: white; margin-top: 30px">Account Details:</h3>
              <p style="color: white">Allied Bank: (ABL)</p>
              <p style="color: white">Title: Premier Information Technologies (Private) Limited</p>
              <p style="color: white">A/C No: 0010110844270010</p>
    
              <p style="color: white; margin-top: 30px">Meezan Bank: (MBL)</p>
              <p style="color: white">Title: Premier Information Technologies (Private) Limited</p>
              <p style="color: white">A/C No: 02040108223973</p>
    
              <h3 style="color: white; margin-top: 30px">How it works?</h3>
              <p style="color: white">
                Visit here to learn more:
                <a style="color: rgb(68, 148, 253)" href="https://hadielearning.com/how-it-works" target="_"
                  >https://hadielearning.com/how-it-works</a
                >
              </p>
    
              <p style="color: white">Thank you for your assistance!</p>
              <p style="color: white">Have any questions? Just let us know; we're here to help!</p>
              <p style="color: white">
                Email:
                <a style="color: rgb(68, 148, 253)" href="info@hadielearning.com" target="_">info@hadielearning.com</a>
              </p>
    
              <p style="color: white">
                WhatsApp:
                <a style="color: rgb(68, 148, 253)" href="tel:+923111193339" target="_">03111193339</a>
              </p>
    
              <p style="color: white; margin-top: 30px">Warm regards,</p>
              <p style="color: white">Hadi E-learning</p>
            </td>
          </tr>
        </table>
      </body>
    </html>`,
  };

  transporter.sendMail(courseEmailData, (error, info) => {
    if (error) {
      console.log(error, "email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const workshopConfirmations = (workshopData, email) => {
  const { heading, firstName, meetingTiming, authorName, link, meetingId, passcodeId } = workshopData;

  const workshopEmail = {
    from: '"Info" <info@hadielearning.com>',
    to: email,
    subject: "Workshop Confirmation Email",
    html: `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Workshop Confirmation</title>
  </head>
  <body style="background-color: white">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0f3f5d" color="white">
    <tr>
    <td style="padding: 20px">
      <h1 style="font-size: 28px; font-weight: bold; color: white; text-align: start; margin-top: 10px">WORKSHOP CONFIRMATION</h1>
      <h2 style="font-size: 24px; font-weight: bold; color: white; text-align: start; margin-top: 20px">${heading}</h2>
      <p style="font-size: 16px; color: white; text-align: start; margin-top: 20px">Hi ${firstName},</p>
      <p style="font-size: 16px; color: white; text-align: start">I hope you're doing well.</p>
      <p style="font-size: 16px; color: white; text-align: start; margin-top: 20px">
        Thank you for registering for our upcoming session. Hadi invites you to a Free Online Workshop.
      </p>
      <p style="font-size: 16px; color: white; text-align: start; font-weight: bold">
        Workshop Date & Time: ${meetingTiming} (Pakistan Time)
      </p>
      <p style="font-size: 16px; color: white; text-align: start">Instructor: ${authorName}</p>
      <p style="font-size: 16px; color: white; text-align: start; margin-top: 20px">
        Please find the link to access the workshop: <br />Join Zoom Meeting<br />
        <a href="${link}" style="color: white" target="_">${link}</a>
      </p>
      <p style="font-size: 16px; color: white; text-align: start; display: flex; flex-direction: row">
        <span style="font-weight: bold"> Meeting ID </span> <span>: ${meetingId}</span>
      </p>
      <p style="font-size: 16px; color: white; text-align: start; display: flex; flex-direction: row">
        <span style="font-weight: bold"> Passcode</span> <span>: ${passcodeId}</span>
      </p>
      <p style="font-size: 16px; color: white; text-align: start; margin-top: 20px">
        If you have any queries regarding the workshop, please do not hesitate to contact us at
        <a href="mailto:Info@hadielearning.com" style="color: white">Info@hadielearning.com</a>.
      </p>
      <p style="font-size: 16px; color: white; text-align: start; margin-top: 20px">Thank you for your interest!</p>
      <p style="font-size: 16px; color: white; text-align: start">Best regards,</p>
      <p style="font-size: 16px; color: white; text-align: start; margin-bottom: 20px">Hadi E-learning</p>
    </td>
  </tr>
    </table>
  </body>
</html>
 
      `,
  };

  transporter.sendMail(workshopEmail, (error, info) => {
    if (error) {
      console.log(error, "email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  SendEmail,
  generateOTP,
  sendEmailForOTP,
  freeCourseConfirmations,
  workshopConfirmations,
  advanceCourseConfirmations,
};
