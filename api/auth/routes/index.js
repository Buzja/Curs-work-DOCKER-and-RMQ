const Koa = require("koa");
const router = require("koa-router")();
const cors = require("koa-cors");
const bodyparser = require("koa-bodyparser");
const json = require("koa-json");
const signupUser = require("../controllers/signupController");
const signinUser = require("../controllers/signinController");
const sendForgotMail = require("../controllers/forgotController");
const sendConfirmMail = require("../controllers/confirmController");
const refreshToken = require("../controllers/refreshTokenController");
const deleteUser = require("../controllers/deleteUser");
const app = new Koa();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.put("/forgot", sendForgotMail);
router.get("/refresh", refreshToken);
router.post("/confirmEmail", sendConfirmMail);
router.delete("/delete", deleteUser);

app
  .use(bodyparser())
  .use(json())
  .use(router.routes(), router.allowedMethods())
  .use(cors());

module.exports = app;
