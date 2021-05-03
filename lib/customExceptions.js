const { HttpStatus } = require("./helpers/constants");

class CustomException {
  message;
  status = HttpStatus.NOTFOUND;
  name = "CustomException";

  constructor(message, status = this.status) {
    this.message = message;
    this.status = status;
  }

  log() {
    return `${this.name}:${this.status}-{message: ${this.message}}`;
  }
}

class DatabaseError extends CustomException {
  name = "DatabaseException";

  constructor(message, status = HttpStatus.INTERNALSERVER) {
    super(message, status);
    this.message = message;
    this.status = status;
  }
}

module.exports = { DatabaseError, CustomException };
