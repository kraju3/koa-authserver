const KoaRouter = require("@koa/router");
const { jwtVerifyMW } = require("../middlewares/authentication.middleware");
const {
  sendResponseFromStateBody,
  prefixMiddleWare,
} = require("../middlewares/common.middleware");
const { deleteUser, updateUser } = require("../middlewares/crud.middleware");
const userActionRouter = new KoaRouter({
  prefix: "/api/v2/user/crud",
});

//common middlewares to check token is present and verification before hitting
//the actual router logic
userActionRouter.get("/", prefixMiddleWare);

userActionRouter
  .use(jwtVerifyMW)
  .post("/delete", deleteUser)
  .post("/update", updateUser)
  .use(sendResponseFromStateBody);

//a common middleware to set the ctx body based on the variable ctx.state.body

module.exports = userActionRouter;
