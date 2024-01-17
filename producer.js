const { kafka } = require("./client");
const readline = require("readline"); ///used for getting an input from the user in terminal
const rl = readline.createInterface({
  input: process.stdin, //input value
  output: process.stdout, //output value
});
async function init() {
  const producer = kafka.producer();
  await producer.connect();
  rl.setPrompt("> ");
  rl.prompt();
  rl.on("line", async function (line) {
    console.log("lineeeeee", line);
    const [riderName, location] = line.split(" ");
    console.log("riderName", riderName, location);

    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          partition: location.toLowerCase() == "north" ? 0 : 1,
          key: "location",
          value: JSON.stringify({ name: riderName, loc: location }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
  console.log("produced message");
}
init();
