const logger = require("../configuration/logger");
const { HttpStatus } = require("../lib/helpers/constants");
const { responseBody } = require("../lib/helpers/util");
const { replaceOne } = require("../models/User/User");

module.exports = {
  errorCatching: async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err?.log?.() ?? err);
    }
  },
  tokenExists: async (ctx, next) => {
    const { authorization } = ctx.request.headers;

    if (!authorization) {
      ctx.status = HttpStatus.UNAUTHORIZED;
      ctx.body = responseBody("Unauthorized,please provide a token");
      throw new CustomException(
        "Token was not provided",
        HttpStatus.UNAUTHORIZED
      );
    }

    const [authType, token] = authorization?.split(" ");

    if (authType === "Bearer") {
      ctx.state.token = token;
      return next();
    }

    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = responseBody("Access token must be provided");
  },
  sendResponseFromStateBody: async (ctx, next) => {
    ctx.body = ctx.state.body;
    await next();
  },
  prefixMiddleWare: async (ctx, next) => {
    ctx.status = 200;
  },
};
