const KoaBody = require("koa-body");
const Koa = require("koa");
const userDb = require("./configuration/db");
const { errorCatching } = require("./middlewares/common.middleware");
const logger = require("./configuration/logger"); // manually set up
require("dotenv").config();

const userAccessRoutes = require("./routes/user_access.routes");
const userCrudRoutes = require("./routes/user_crud");
const commonRouter = require("./routes/common_routes");

const app = (module.exports = new Koa());

app.use(KoaBody());

//error catching middleware
app.use(errorCatching);

commonRouter
  .use(userAccessRoutes.routes(), userAccessRoutes.allowedMethods())
  .use(userCrudRoutes.routes(), userCrudRoutes.allowedMethods());

app.use(commonRouter.routes()).use(commonRouter.allowedMethods());

if (!module.parent)
  app.listen(process.env.HOST_PORT, () => {
    logger.info("Server started at port 3000");
    userDb.connect();
  });
