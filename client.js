const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "practiceKafka", //can be anything based on your project
  brokers: ["10.10.2.13:9092"], //url where the whole kafka service is running
});
