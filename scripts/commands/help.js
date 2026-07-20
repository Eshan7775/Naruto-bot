module.exports = {
  config: {
    name: "help",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 0,
    shortDescription: "Show all available commands",
    longDescription: "Displays the list of all bot commands and details",
    category: "system",
    guide: "{pn} or {pn} [command_name]"
  },

  onStart: async function ({ api, event, args, message }) {
    const { commands } = global.GoatBot;
    const prefix = global.GoatBot.config.prefix || "!";

    // If user types '!help [command_name]'
    if (args[0]) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName);

      if (!command) {
        return message.reply(`❌ '${commandName}' নামে কোনো কমান্ড খুঁজে পাওয়া যায়নি।`);
      }

      const { config } = command;
      let detailText = `🔍 [ COMMAND DETAILS ]\n━━━━━━━━━━━━━━━\n`;
      detailText += `• Name: ${config.name}\n`;
      detailText += `• Description: ${config.shortDescription || "No description"}\n`;
      detailText += `• Usage: ${config.guide ? config.guide.replace(/{pn}/g, prefix + config.name) : prefix + config.name}\n`;
      detailText += `• Category: ${config.category || "General"}\n`;
      detailText += `━━━━━━━━━━━━━━━\n𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;

      return message.reply(detailText);
    }

    // If user types just '!help'
    let commandList = [];
    commands.forEach((cmd) => {
      if (cmd.config && cmd.config.name) {
        commandList.push(`• ${prefix}${cmd.config.name}`);
      }
    });

    let helpText = `📜 [ BOT COMMAND LIST ]\n━━━━━━━━━━━━━━━\nTotal Commands: ${commandList.length}\n\n`;
    helpText += commandList.join("\n");
    helpText += `\n━━━━━━━━━━━━━━━\n𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;

    return message.reply(helpText);
  }
};
