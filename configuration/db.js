const mongoose = require("mongoose");
const logger = require("./logger");

require("dotenv").config();

const DB_URL = process.env.DB_URL;

module.exports = {
  connect: () =>
    mongoose.connect(
      DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          logger.error("Error connecting to the database");
          return;
        }

        logger.info("Connected to the User Collection");
      }
    ),
};
