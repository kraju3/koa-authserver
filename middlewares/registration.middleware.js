const KoaCompose = require("koa-compose");
const bcrypt = require("bcrypt");
const { DatabaseError, CustomException } = require("../lib/customExceptions");
const { HttpStatus, SALT_ROUNDS } = require("../lib/helpers/constants");
const User = require("../models/User/User");
const { userValidations } = require("../models/validations/user.validations");
const { responseBody } = require("../lib/helpers/util");

const validationMiddleWare = async (ctx, next) => {
  let userInfo = ctx.request.body;

  try {
    userInfo = await userValidations.validate(userInfo);
    ctx.state.userInfo = userInfo;
  } catch (validationErrors) {
    ctx.status = HttpStatus.BADREQUEST;
    ctx.body = responseBody({ errors: validationErrors.errors });
    ctx.throw(HttpStatus.BADREQUEST, "User data is not valid", {
      errors: validationErrors.errors,
    });
  }

  await next();
};

const userExist = async (ctx, next) => {
  const user = ctx.state.userInfo;

  const isUser = await User.getUserByUserName(user.userName);

  if (isUser) {
    ctx.status = HttpStatus.BADREQUEST;
    ctx.body = responseBody("User already exists");
    throw new DatabaseError("User already exists");
  } else {
    return next();
  }
};

const hashPassword = async (ctx, next) => {
  const user = ctx.state.userInfo;
  try {
    const hashPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    ctx.state.userInfo = {
      ...user,
      password: hashPassword,
    };
    await next();
  } catch (err) {
    ctx.status = HttpStatus.INTERNALSERVER;
    ctx.body = responseBody(err.messaage ?? `${err}`);
    throw new CustomException(`Hashing Password gone wrong`, 500);
  }
};

const registerUser = async (ctx, next) => {
  try {
    const { userInfo } = ctx.state;

    const newUser = new User(userInfo);
    await newUser.createUser();
    ctx.body = responseBody("User is created successfully");
    ctx.status = HttpStatus.OK;
  } catch (err) {
    ctx.status = 400;
    ctx.body = responseBody(err.message || "ERROR: Creating the user");
    ctx.throw(HttpStatus.INTERNALSERVER, "ERROR: Creating the user", { err });
  }
};

//compose the middlewares into one
//First checks validation of post data, then check if the username exists, then hashPassword, then registerUser in the backend.
module.exports = KoaCompose([
  validationMiddleWare,
  userExist,
  hashPassword,
  registerUser,
]);
