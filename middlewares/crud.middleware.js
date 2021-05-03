const { CustomException } = require("../lib/customExceptions");
const { HttpStatus } = require("../lib/helpers/constants");
const User = require("../models/User/User");

module.exports = {
  deleteUser: async (ctx, next) => {
    const token = ctx.state.token;

    const user = await User.getUserByUserName(token.userName);

    if (user) {
      user.deleteUser();
      ctx.state.body = JSON.stringify({
        message: "User was succesfully deleted and deactivated",
      });
      ctx.status = HttpStatus.OK;
      await next();
    } else {
      ctx.status = HttpStatus.BADREQUEST;
      ctx.body = JSON.stringify({ message: "Invalid user credentials" });
      throw new CustomException(
        "User was not found in the database",
        HttpStatus.INTERNALSERVER
      );
    }
  },
  updateUser: async (ctx, next) => {
    const token = ctx.state.token;
    const updatedInfo = ctx.request.body;

    const user = await User.updateUser({
      userName: token.userName,
      ...updatedInfo,
    });

    if (user) {
      ctx.status = HttpStatus.OK;
      ctx.state.body = JSON.stringify({
        message: "User details updated successfully",
      });
      return next();
    }

    ctx.status = HttpStatus.BADREQUEST;
    ctx.body = "The updated body format might be wrong";
    throw new CustomException(
      "User did not update successfully",
      HttpStatus.BADREQUEST
    );
  },
};
