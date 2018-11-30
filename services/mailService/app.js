const Koa = require("koa");
const cors = require("koa-cors");
const bodyparser = require("koa-bodyparser");
const { MAIL_PORT, mailQueue, errorQueue } = require("../../config");
const mailService = require("./mailService");
const errorService = require("./errorService");
const amqp = require("../../amqp");

const app = new Koa();

const startListening = async () => {
  try {
    await app.use(cors()).use(bodyparser());

    await amqp.getFromQueue(errorQueue, errorService);
    await amqp.getFromQueue(mailQueue, mailService);

    connection = await app.listen(MAIL_PORT);
    console.log(`Server listening ${MAIL_PORT}`);
  } catch (err) {
    throw err;
  }
};

const run = async () => {
  await startListening().catch(error => console.error(error));
};

run().catch(error => console.error(error));
