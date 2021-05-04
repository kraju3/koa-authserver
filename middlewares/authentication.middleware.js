//this will be the middlware that takes care of login with a username and a password provided
/**
 * First thing to do is to implemenet token authentication for user after they login
 * First when the user submits a post call to the "/login" route we would first check if the username exists in the database
    before comparing the hashed password
 * Then if the user exists we would create a JWT token with the payload of the username and maybe their rights "admin, user etc"
 * Then we would send the token along with the response 
 * Refresh Tokens??? TBD how to implement them. Need to do a POC
 * 
 */
const KoaCompose = require("koa-compose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  sendResponseFromStateBody,
  tokenExists,
} = require("./common.middleware");
const { CustomException } = require("../lib/customExceptions");
const { HttpStatus, JWT_SECRET } = require("../lib/helpers/constants");
const User = require("../models/User/User");

//Middleware to check if the userExists in the database
const getUser = async (ctx, next) => {
  let userCreds = (ctx.state.userCreds = ctx.request.body);

  const existingUser = await User.getUserByUserName(userCreds.userName);

  if (existingUser) {
    ctx.state.user = existingUser;
    await next();
  } else {
    ctx.status = HttpStatus.BADREQUEST;
    ctx.body = `The user does not exist`;
  }
};

const comparePassword = async (ctx, next) => {
  try {
    const { user, userCreds } = ctx.state;

    const isValid = await bcrypt.compare(userCreds.password, user.password);

    if (isValid) {
      await next();
    } else {
      ctx.status = HttpStatus.BADREQUEST;
      ctx.body = `The user credentials you provided are incorrect`;
    }
  } catch (err) {
    ctx.status = HttpStatus.INTERNALSERVER;
    ctx.body = `${err}`;
    throw new CustomException("Password is invalid", HttpStatus.INTERNALSERVER);
  }
};

const generateToken = async (ctx, next) => {
  const user = ctx.state.user;

  try {
    const jwtToken = await jwt.sign({ userName: user.userName }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "30m",
    });
    ctx.status = HttpStatus.OK;
    ctx.state.body = { token: `Bearer ${jwtToken}` };
    await next();
  } catch (err) {
    ctx.status = HttpStatus.INTERNALSERVER;
    ctx.body = `${err}`;
    throw new CustomException("Error while creating JWT token", 500);
  }
};

const verifyToken = async (ctx, next) => {
  let token = ctx.state.token;

  try {
    const isValid = await jwt.verify(token, JWT_SECRET);
    if (isValid) {
      ctx.state.token = isValid;
      await next();
    } else {
      ctx.status = HttpStatus.UNAUTHORIZED;
      ctx.body = "Invalid token please try again with a valid token";
      throw new CustomException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    ctx.status = HttpStatus.INTERNALSERVER;
    ctx.body = err.message ?? "Invalid token";
    throw new CustomException(err.message, HttpStatus.INTERNALSERVER);
  }
};

module.exports = {
  loginMiddleWare: new KoaCompose([
    getUser,
    comparePassword,
    generateToken,
    sendResponseFromStateBody,
  ]),
  jwtVerifyMW: new KoaCompose([tokenExists, verifyToken]),
};
