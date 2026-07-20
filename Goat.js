const fs = require("fs");
const path = require("path");

module.exports = function ({ api, event }) {
  // Check if message is a command
  const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const prefix = config.prefix || "/";

  if (!event.body || !event.body.startsWith(prefix)) return;

  const args = event.body.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const commandPath = path.join(__dirname, "scripts", "commands", `${commandName}.js`);

  if (fs.existsSync(commandPath)) {
    try {
      const command = require(commandPath);
      if (command.onStart) {
        command.onStart({ api, event, args });
      }
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      api.sendMessage(`❌ কমান্ড রান করতে সমস্যা হয়েছে: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
