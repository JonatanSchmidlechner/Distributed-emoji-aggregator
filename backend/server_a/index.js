import {Kafka} from "kafkajs";

const socket = new WebSocket("ws://localhost:80")


const kafka = new Kafka({
    clientId: "server_a",
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const aggregatedDataTopic = "aggregated-emote-data"
const consumer = kafka.consumer({groupId: "server_b"});
await consumer.connect();
await consumer.subscribe({topics: [aggregatedDataTopic], fromBeginning: true})

await consumer.run({
    eachMessage: async ({ rawDataTopic, partition, message}) => {
        if(!(message && message.timeStamp && message.emote && message.count && message.totalEmotes)) {
            console.log("Invalid data from aggregation");
            return;
        }
        console.log("server_A", message)
        socket.send(message);
    }
})