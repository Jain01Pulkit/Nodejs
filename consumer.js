const { kafka } = require("./client");
const group = process.argv[2]; //used for fetching group name from terminal, type node consumer.js groupName on terminal for making a consumer in another group or same group
async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group} [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}
init();
