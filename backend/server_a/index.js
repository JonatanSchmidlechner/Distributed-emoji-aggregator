import {Kafka} from "kafkajs";
import { WebSocketServer } from 'ws';

const socket = new WebSocketServer({port: 8082})

let theClient = null;
socket.on("connection", (ws) => {
    console.log("Hello client!");
    theClient = ws;
})
socket.on("close", (ws) => {
    theClient = null;
});

const kafka = new Kafka({
    clientId: "server_a",
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const aggregatedDataTopic = "aggregated-emote-data"
const consumer = kafka.consumer({groupId: "server_a"});
await consumer.connect();
await consumer.subscribe({topics: [aggregatedDataTopic], fromBeginning: true})

await consumer.run({
    eachMessage: async ({ rawDataTopic, partition, message}) => {
        if(theClient && theClient.readyState === theClient.OPEN) {
            theClient.send(message.value.toString());
        }
    }
})