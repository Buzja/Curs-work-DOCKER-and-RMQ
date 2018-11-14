const User = require("../models/user");
const {
  homeUrl,
  changePasswordTemplatePath,
  mailQueue
} = require("../../../config");
const sendToQueue = require("../../../tasks/sendToQueueTask");

const sendForgotMail = async ctx => {
  try {
    const { email } = ctx.request.body;
    const user = await User.findOne({ email });

    if (!user) {
      const err = new Error();
      err.status = 400;
      err.message = "Email not found";
      throw err;
    }

    await sendToQueue(mailQueue, {
      email,
      subject: "Change password",
      htmlTemplatePath: changePasswordTemplatePath,
      url: homeUrl,
      countOfTries: 0
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Confirm your actions on the mail"
    };
  } catch (err) {
    if (err.status !== undefined) {
      ctx.status = err.status;
      ctx.body = { success: false, message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { success: false, message: "Internal server error" };
    }
  }
};

module.exports = sendForgotMail;
