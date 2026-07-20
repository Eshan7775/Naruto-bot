module.exports = {
  config: {
    name: "emojireply",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 0,
    role: 0,
    shortDescription: "Auto reply to specific emoji combinations",
    longDescription: "Automatically replies with a custom response when targeted emojis are sent",
    category: "system",
    guide: ""
  },

  onStart: async function () {
    // No manual command trigger needed
  },

  onChat: async function ({ api, event, message }) {
    const { body, senderID } = event;
    if (!body) return;

    const ownerUID = "61591534221882"; // OWNER EMON / NARUTO UID
    const gfUID = "GF_UID_HERE";      // GF / Bhabhi UID

    // Owner and GF will be ignored by this feature
    if (senderID === ownerUID || senderID === gfUID) return;

    // Targeted emoji combinations
    const targetEmojis = ["🙂🍿", "🍿", "🎬", "🙂🎬"];

    const trimmedBody = body.trim();
    const isTargetEmoji = targetEmojis.some((emoji) => trimmedBody === emoji);

    if (isTargetEmoji) {
      const replyText = `𝗧𝗺𝗿 𝗺𝗮𝘁𝗵𝗮𝘆 𝗝𝗲 𝗚𝘂 𝗮𝗰𝗵𝗲 𝗼𝗶𝘁𝗮 𝗽𝗿𝗼𝘃𝗲𝗱 𝗸𝗼𝗶𝗿𝗼 𝗻𝗵 𝗕𝗿𝗮𝗶𝗻𝗹𝗲𝘀𝘀 𝗺𝗲𝗺𝗯𝗲𝗿..!! 🤡😹\n━━━━━━━━━━━━━━━\n𝗧𝗛𝗜𝗦 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗠𝗬 𝗢𝗪𝗡𝗘𝗥 𝗡𝗔𝗥𝗨𝗧𝗢`;
      
      return message.reply(replyText);
    }
  }
};
