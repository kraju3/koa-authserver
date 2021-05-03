const Yup = require("yup");
const { PasswordRegex, PhoneRegex } = require("../../lib/helpers/constants");

module.exports = Yup.object({
  userName: Yup.string()
    .min(5, "Username is too short")
    .max(20, "Username is too long")
    .required("Username is not provided")
    // .test({
    //   name: "no space",
    //   exclusive: true,
    //   message: "Username should not contain any spaces",
    //   test: (val) => val.indexOf(" ") !== -1,
    // })
    .trim(),
  password: Yup.string()
    .max(19, "Password is too long")
    .min(7, "Password is too short")
    .matches(PasswordRegex, {
      message: "Password should contain a number and a special character",
      excludeEmptyString: true,
    })
    .trim()
    .required("Password must be provided"),
  firstname: Yup.string()
    .max(30, "First name is too long")
    .min(2, "First name is too short")
    .required("First name is required"),
  lastname: Yup.string()
    .max(30, "Last name is too long")
    .min(2, "Last name is too short")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please provide a valid email")
    .max(50, "Email is too long")
    .required(),
  phoneNumber: Yup.string().trim().matches(PhoneRegex, {
    message: "Phone number is in an invalid format",
    excludeEmptyString: true,
  }),
});
