const mongoose = require("mongoose");
const logger = require("../../configuration/logger");
const { DatabaseError } = require("../../lib/customExceptions");
const { userValidationMessages } = require("../../lib/helpers/constants");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: [true, userValidationMessages.userName] },
  password: { type: String, required: [true, userValidationMessages.password] },
  firstname: {
    type: String,
    required: [true, userValidationMessages.firstname],
  },
  lastname: { type: String, required: [true, userValidationMessages.lastname] },
  email: {
    type: String,
    required: [true, userValidationMessages.email],
  },
  phoneNumber: {
    type: String,
    required: [true, userValidationMessages.phone],
  },
});

UserSchema.statics.updateUser = async (updatedInfo) => {
  try {
    const { userName, ...restOfUserInfo } = updatedInfo;
    logger.info("Updating the User");
    return await this.findOneAndUpdate(
      { userName },
      {
        ...restOfUserInfo,
      },
      { new: true }
    );
  } catch (err) {
    logger.error("Error updating the User-->User not found");
    throw new DatabaseError(`${err}---> ERROR-- Updating the user information`);
  }
};

UserSchema.methods.deleteUser = async function () {
  try {
    logger.info("Deleting the user", this.userName);
    return await this.deleteOne({ userName: this.userName });
  } catch (err) {
    logger.error("Error deleting the user");
    throw new DatabaseError("Error deleting the user");
  }
};

UserSchema.statics.getUserByUserName = async function (userName) {
  try {
    return await this.findOne({ userName });
  } catch (err) {
    logger.error("Cannot find the user by username");
    throw new DatabaseError(
      `Error getting the User with the userName -- ${err}`
    );
  }
};

UserSchema.methods.createUser = async function () {
  try {
    logger.info("Creating the user in the database");
    return await this.save();
  } catch (err) {
    logger.error("Error when tried to create the user");
    throw new DatabaseError(`Error creating the user ${err}}`);
  }
};

const User = mongoose.model("users", UserSchema);

module.exports = User;
