const { CustomException } = require("../lib/customExceptions");
const { HttpStatus } = require("../lib/helpers/constants");
const { responseBody } = require("../lib/helpers/util");
const User = require("../models/User/User");
const { updateValidations } = require("../models/validations/user.validations");

module.exports = {
  deleteUser: async (ctx, next) => {
    const token = ctx.state.token;

    const user = await User.getUserByUserName(token.userName);

    if (user) {
      user.deleteUser();
      ctx.state.body = responseBody(
        "User was succesfully deleted and deactivated"
      );
      ctx.status = HttpStatus.OK;
      await next();
    } else {
      ctx.status = HttpStatus.BADREQUEST;
      ctx.body = responseBody("Invalid user credentials");
      throw new CustomException(
        "User was not found in the database",
        HttpStatus.INTERNALSERVER
      );
    }
  },

  validateUpdateData: async (ctx, next) => {
    try {
      const isValid = await updateValidations.validate(ctx.request.body);
      if (isValid) {
        await next();
      }
    } catch (err) {
      ctx.status = HttpStatus.BADREQUEST;
      ctx.body = responseBody({ errors: err.errors });
    }
  },
  updateUser: async (ctx, next) => {
    const token = ctx.state.token;
    const updatedInfo = ctx.request.body;

    if (updatedInfo.userName || updatedInfo.password) {
      ctx.status = 404;
      ctx.body = responseBody("Username is not allowed to be updated");
      throw new CustomException("Cannot update the username");
    }

    const user = await User.updateUser({
      userName: token.userName,
      ...updatedInfo,
    });

    if (user) {
      ctx.status = HttpStatus.OK;
      ctx.state.body = responseBody("User details updated successfully");
      return next();
    }

    ctx.status = HttpStatus.BADREQUEST;
    ctx.body = responseBody("The updated body format might be wrong");
    throw new CustomException(
      "User did not update successfully",
      HttpStatus.BADREQUEST
    );
  },
};
