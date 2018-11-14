const mongoose = require("mongoose");
const User = require("../models/user");
const sendToQueue = require("../../../tasks/sendToQueueTask");
const {
  confirmUrl,
  confirmEmailTemplatePath,
  mailQueue
} = require("../../../config");

const signupUser = async ctx => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: ctx.request.body.name,
    email: ctx.request.body.email,
    password: ctx.request.body.password
  });
  try {
    await user.save();

    await sendToQueue(mailQueue, {
      email: user.email,
      subject: "Confirm email",
      htmlTemplatePath: confirmEmailTemplatePath,
      url: confirmUrl,
      countOfTries: 0
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "User was registered",
      isConfirmed: false
    };
  } catch (err) {
    if (err.code === 11000) {
      ctx.status = 409;
      ctx.body = { success: false, message: "This email already exist!" };
    } else {
      ctx.status = 400;
      ctx.body = { success: false, code: err.code, message: "Uncorrect data" };
    }
  }
};

module.exports = signupUser;
