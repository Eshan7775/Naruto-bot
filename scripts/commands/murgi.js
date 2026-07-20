module.exports = {
  config: {
    name: "murgi",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 5,
    role: 1, // Admin & Sub-Admin only
    shortDescription: "Target murgi with interval messages",
    longDescription: "Troll targeted user continuously",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event, args, message }) {
    const { mentions } = event;
    const mentionIDs = Object.keys(mentions);

    if (mentionIDs.length === 0) {
      return message.reply("⚠️ Kake murgi বানাতে চান, তাকে মেনশন করুন! (Example: !murgi @user)");
    }

    const targetID = mentionIDs[0];
    const targetName = mentions[targetID].replace("@", "");

    const trollMessages = [
      `${targetName} kothay palali? Aaye murgi bokshi dijilam! 🐔`,
      `Oi ${targetName}, tor roboter sathe takka dewar khomota nai! 😎`,
      `Murgi detected! ${targetName} ekhon amar murgi! 🍗`
    ];

    message.reply(`🎯 Target set on ${targetName}! Murgi trolling started...`);

    for (let i = 0; i < trollMessages.length; i++) {
      setTimeout(async () => {
        await api.sendMessage(trollMessages[i], event.threadID);
      }, (i + 1) * 3000); // 3-second interval
    }
  }
};
