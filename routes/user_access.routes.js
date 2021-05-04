const KoaRouter = require("@koa/router");
const loginRegisterRouter = new KoaRouter({
  prefix: "/api/v2/user",
});
const registrationMiddleWare = require("../middlewares/registration.middleware");
const { loginMiddleWare } = require("../middlewares/authentication.middleware");
const { prefixMiddleWare } = require("../middlewares/common.middleware");

//routes definition, the routes can be  chained because .verb() returns the router instance

loginRegisterRouter
  .get("/", prefixMiddleWare)
  .post("/register", registrationMiddleWare)

  .post("/login", loginMiddleWare);

module.exports = loginRegisterRouter;
