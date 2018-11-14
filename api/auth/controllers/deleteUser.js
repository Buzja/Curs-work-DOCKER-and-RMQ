const User = require("../models/user");

const signinUser = async ctx => {
  try {
    const { email } = ctx.request.body;
    const user = await User.findOne({ email });

    if (!user) {
      const err = new Error();
      err.status = 400;
      err.message = "User not found";
      throw err;
    }

    await user.remove();
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (err) {
    if (err.status !== undefined) {
      ctx.status = err.status;
      ctx.body = { success: false, message: err.message };
    } else {
      console.log(err);
    }
  }
};

module.exports = signinUser;
