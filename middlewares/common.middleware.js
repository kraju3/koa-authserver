const logger = require("../configuration/logger");
const { HttpStatus } = require("../lib/helpers/constants");

module.exports = {
  errorCatching: async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err?.log?.() ?? err);
    }
  },
  tokenExists: async (ctx, next) => {
    const token = ctx.request.headers.authorization;

    const tokenTypeAndValue = token?.split(" ");

    if (tokenTypeAndValue?.[0] === "Bearer") {
      ctx.state.token = tokenTypeAndValue[1];
      return next();
    }

    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = "Access token must be provided";
  },
  sendResponseFromStateBody: async (ctx, next) => {
    ctx.body = ctx.state.body;
    await next();
  },
};
