const sendToQueue = require("../../tasks/sendToQueueTask");

const errorService = async ({ queue, data }) => {
  console.log(
    "error with queue: " + queue + "with data: " + JSON.stringify(data)
  );
  setTimeout(async () => {
    console.log("Sended");
    await sendToQueue(queue, data);
  }, 5000);
};

module.exports = errorService;
