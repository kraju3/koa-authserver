const KoaRouter = require("@koa/router");
const { prefixMiddleWare } = require("../middlewares/common.middleware");

const commonRouter = (module.exports = new KoaRouter());

commonRouter.get("/", prefixMiddleWare);
