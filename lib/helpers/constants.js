const userValidationMessages = {
  userName: "Username is required",
  email: "Email is required",
  phone: "Phone number is required",
  firstname: "First name is required",
  lastname: "Last name is required",
  password: "Password is required",
};

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const HttpStatus = {
  OK: 200,
  INTERNALSERVER: 500,
  BADREQUEST: 400,
  NOTFOUND: 404,
  UNAUTHORIZED: 401,
};

const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,15}$/;
const PhoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

module.exports = {
  userValidationMessages,
  PasswordRegex,
  PhoneRegex,
  HttpStatus,
  SALT_ROUNDS,
  JWT_SECRET,
};
