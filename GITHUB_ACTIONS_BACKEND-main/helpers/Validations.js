const validateEnollments = (body) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    parentOccupations,
    parentName,
    city,
    dateOfBirth,
    gender,
    education,
    enrollTo,
    course,
    workshop,
    policyAccepted,
  } = body;
  const errors = [];

  if (firstName.length < 3) errors.push("The first name should be a minimum of three characters long");
  if (lastName.length < 3) errors.push("The last name should be a minimum of three characters long");
  if (!email) errors.push("Email should be a valid email address");
  if (!phoneNumber) errors.push("Please enter your phone number");
  if (!address) errors.push("Address is required!");
  if (!parentOccupations) errors.push("Please complete occupation");
  if (parentName.length < 3) errors.push("Father name is required!");
  if (!city) errors.push("City is required!");
  if (!dateOfBirth) errors.push("Date of birht is required!");
  if (!gender) errors.push("Gender is required!");
  if (!education) errors.push("Education is required!");
  if (!enrollTo) errors.push("where you want to enroll?");
  if (enrollTo === "program" && !course) errors.push("please select the programs  ");
  if (enrollTo === "workshop" && !workshop) errors.push("Please select the workshop");
  if (!policyAccepted) errors.push("Please accept the term and condition");

  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateEnollments,
};
