const amqp = require("../amqp");

const sendToQueue = async(queue,data)=>{
    await amqp.sendToQueue(queue,data)
}

module.exports = sendToQueue;