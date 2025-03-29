import Kafka from "kafkajs";
import * as fs from "fs";
import aggregateData from "./dataAggregater";

const kafka = new Kafka({
    clientId: "server_b",
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const topic = "raw-emote-data"
let interval = 10, threshold =10, allowedEmotes = [], lastModifyTimestamp = 0;
await loadSettings();


const consumer = kafka.consumer();
const producer = kafka.producer();

await consumer.connect();
await consumer.subscribe({topic, fromBeginning: true})

await producer.connect();

// Array to store data, which will eventually be sent to be analysed.
let rawData = [];

await consumer.run({
    eachMessage: async ({ topic, partition, message}) => {
        console.log(message.value);
        /*
        if (rawData.emote not in allowedEmotes) {
            return;
        }
        */
        rawData.push(message.value);
        if (rawData.length >= interval) {
            const rawDataCopy = [...rawData];
            rawData = [];
            processData(rawDataCopy);
            
        }
    }
})

const processData = async (data) => {
    const aggregation = await aggregateData(data, threshold);
    console.log(aggregation);
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(aggregation)} ]
    });
}


const loadSettings = async () => {
    try {
        const data = await fs.promises.readFile(process.env.SETTINGSPATH, "utf-8");
        settings = JSON.parse(data);
        interval = settings.interval, threshold=settings.threshold, allowedEmotes = settings.allowedEmotes;
        const stats = await fs.promises.stats(process.env.SETTINGSPATH, "utf-8");
        lastModifyTimestamp = stats.mtime;
    } catch (error) {
        throw new Error("Could not read settings");
    }
    console.log(interval)
}

setInterval( async () => {
    try {
        const modifyTimestamp = (await fs.promises.stat(process.env.SETTINGSPATH)).mtime;
        if (modifyTimestamp > lastModifyTimestamp) {
            loadSettings();
            lastModifyTimestamp = modifyTimestamp;
        }
    } catch (error) {
        console.log(error)
    }
}, 10000)