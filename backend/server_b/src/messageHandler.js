import {Kafka} from "kafkajs";
import * as fs from "fs";
import {aggregateData} from "./dataAggregater.js";
console.log("run kafka");
const kafka = new Kafka({
    clientId: "server_b",
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const rawDataTopic = "raw-emote-data"
const aggregatedDataTopic = "aggregated-emote-data"
let interval = 10, threshold =10, allowedEmotes = [], lastModifyTimestamp = 0;


const consumer = kafka.consumer({groupId: "server_b"});
const producer = kafka.producer({groupId: "server_b_producer"});

await consumer.connect();
await consumer.subscribe({topics: [rawDataTopic], fromBeginning: true})

await producer.connect();
const loadSettings = async () => {
    try {
        const data = await fs.promises.readFile(process.env.SETTINGSPATH, "utf-8");
        const settings = JSON.parse(data);
        interval = settings.interval, threshold=settings.threshold, allowedEmotes = settings.allowedEmotes;
        const stats = await fs.promises.stat(process.env.SETTINGSPATH, "utf-8");
        lastModifyTimestamp = stats.mtime;
    } catch (error) {
        console.log(error)
        throw new Error("Could not read settings");
    }
}
await loadSettings();

// Array to store data, which will eventually be sent to be analysed.
let rawData = [];

await consumer.run({
    eachMessage: async ({ rawDataTopic, partition, message}) => {
        const decodedRecord = message.value.toString('utf-8')
        const jsonRecord = JSON.parse(decodedRecord);
        if (!allowedEmotes.includes(jsonRecord.emote)) {
            return;
        }
        rawData.push(jsonRecord);
        if (rawData.length >= interval) {
            const rawDataCopy = [...rawData];
            rawData = [];
            processData(rawDataCopy);
            
        }
    }
})

const processData = async (data) => {
    const aggregation = await aggregateData(data, threshold);
    console.log("datamining aggregation", aggregation);
    await producer.send({
        topic: aggregatedDataTopic,
        messages: [{ value: JSON.stringify(aggregation)} ]
    });
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