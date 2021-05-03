const KoaBody = require("koa-body");
const Koa = require("koa");
const userDb = require("./configuration/db");
const { errorCatching } = require("./middlewares/common.middleware");
const logger = require("./configuration/logger"); // manually set up
require("dotenv").config();

const userAccessRoutes = require("./routes/user_access.routes");
const userCrudRoutes = require("./routes/user_crud");

const app = (module.exports = new Koa());

app.use(KoaBody());

//error catching middleware
app.use(errorCatching);

app.use(userAccessRoutes.routes()).use(userAccessRoutes.allowedMethods());
app.use(userCrudRoutes.routes()).use(userCrudRoutes.allowedMethods());

if (!module.parent)
  app.listen(process.env.HOST_PORT, () => {
    logger.info("Server started at port 3000");
    userDb.connect();
  });
