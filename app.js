const Koa = require("koa");
const cors = require("koa-cors");
const bodyparser = require("koa-bodyparser");
const mount = require("koa-mount");
const mongoose = require("mongoose");
const { MONGO_URL, PORT, mailQueue, errorQueue } = require("./config");
const authRoutes = require("./api/auth/routes");
const authorizationChecker = require("./midleware/authChecker");
// const mailService = require("./services/mailService");
// const errorService = require("./services/errorService");
// const amqp = require("./amqp");

const app = new Koa();
let connection = null;
mongoose.Promise = global.Promise;
mongoose.set("debug", true);

const startListening = async () => {
  try {
    console.log("Successfully connected to MongoDB");
    await app
      .use(cors())
      .use(bodyparser())
      .use(authorizationChecker)
      .use(mount("/auth", authRoutes));

    // await amqp.getFromQueue(errorQueue, errorService);
    // await amqp.getFromQueue(mailQueue, mailService);

    connection = await app.listen(PORT);
    console.log(`Server listening ${PORT}`);
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connection Established");
  startListening().catch(error => console.error(error));
});

mongoose.connection.on("reconnected", () => {
  console.log("Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("Connection Disconnected");
  connection.close();
});

mongoose.connection.on("close", () => {
  console.log("Connection Closed");
  connection.close();
});

mongoose.connection.on("error", error => {
  console.log("ERROR: " + error);
  connection.close();
});

const run = async () => {
  await mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: 100000,
      reconnectInterval: 3000
    }
  );
};

run().catch(error => console.error(error));
