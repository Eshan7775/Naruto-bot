module.exports = {
  config: {
    name: "uid",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 0,
    shortDescription: "Get user Facebook UID",
    longDescription: "Shows your own UID, replied user's UID, or mentioned user's UID",
    category: "utility",
    guide: "{pn} | {pn} @mention | reply with {pn}"
  },

  onStart: async function ({ api, event, message }) {
    const { mentions, senderID, type, messageReply } = event;

    // 1. If user replied to someone's message
    if (type === "message_reply") {
      const targetUID = messageReply.senderID;
      return message.reply(`🆔 User UID: ${targetUID}\n━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`);
    }

    // 2. If user mentioned someone with @
    const mentionIDs = Object.keys(mentions);
    if (mentionIDs.length > 0) {
      let response = `🆔 [ USER UID LIST ]\n━━━━━━━━━━━━━━━\n`;
      mentionIDs.forEach((id) => {
        const name = mentions[id].replace("@", "");
        response += `• ${name}: ${id}\n`;
      });
      response += `━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;
      return message.reply(response);
    }

    // 3. If user just typed !uid (Shows own UID)
    return message.reply(`🆔 Your UID: ${senderID}\n━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`);
  }
};
