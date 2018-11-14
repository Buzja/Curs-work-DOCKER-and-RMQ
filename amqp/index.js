process.env.CLOUDAMQP_URL = 'amqp://localhost';
const url = process.env.CLOUDAMQP_URL;
const amqp = require("amqplib");

const createChannel = async(mode,queue,data) =>{
    try{
        const connection = await amqp.connect(url);
        let createdChannel = await connection.createChannel();
        await mode(createdChannel,queue,data);
    }
    catch(err){
        throw err;
    }
}

const read = async(channel,queue,func) =>{
    try{
        await channel.assertQueue(queue, {durable: true});
        await channel.prefetch(1);
        await channel.consume(queue, (msg)=>{
            if(msg !== null){
                func(JSON.parse(msg.content));
                channel.ack(msg);
            }
        });
    }
    catch(err){
        throw err;
    }
}

const write = async(channel,queue,information) =>{
    try{
        await channel.assertQueue(queue, {durable: true});
        await channel.sendToQueue(queue,new Buffer(JSON.stringify(information)), {persistent: true});
    }
    catch(err){
        throw err;
    }

}

module.exports.getFromQueue = (queue,callback) => createChannel(read,queue,callback);
module.exports.sendToQueue = (queue,information) => createChannel(write,queue,information);