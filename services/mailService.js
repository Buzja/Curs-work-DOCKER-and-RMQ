const nodemailer = require("nodemailer");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { mailUser, mailPass, mailQueue, errorQueue } = require("../config");
const handlebars = Promise.promisifyAll(require("handlebars"));
const {
  generateRefreshToken
} = require("../api/auth/controllers/generateToken");
const sendToQueue = require("../tasks/sendToQueueTask");

const mailService = async ({
  email,
  subject,
  htmlTemplatePath,
  url,
  countOfTries
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Mail.ru",
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });

    const htmlTemplate = await fs.readFileAsync(htmlTemplatePath, "utf8");
    const template = await handlebars.compile(htmlTemplate);
    const token = await generateRefreshToken({ email });
    const data = {
      url: `${url}/?token=${token}`
    };
    const html = await template(data);

    const message = {
      from: `EffectiveSoft<${mailUser}>`,
      to: email,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(message).catch(err => {
      //TODO: обертка для ошибок
      err.status = 400;
      err.message = "Can't send message";
      throw err;
    });
    transporter.close();
  } catch (err) {
    console.log(err);
    countOfTries += 1;
    if (countOfTries < 5) {
      await sendToQueue(errorQueue, {
        queue: mailQueue,
        data: {
          email,
          subject,
          htmlTemplatePath,
          url,
          countOfTries: countOfTries
        }
      });
    }
  }
};

module.exports = mailService;
