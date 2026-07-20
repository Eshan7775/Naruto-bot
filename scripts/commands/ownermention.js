const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const mentionFile = path.join(cacheDir, "ownerMentions.json");

function getMentionData() {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  if (!fs.existsSync(mentionFile)) fs.writeFileSync(mentionFile, "{}");
  return fs.readJsonSync(mentionFile);
}

function saveMentionData(data) {
  fs.writeJsonSync(mentionFile, data, { spaces: 2 });
}

module.exports = {
  config: {
    name: "ownermention",
    version: "1.1.0",
    author: "OWNER EMON",
    countDown: 0,
    role: 0,
    shortDescription: "Notify owner on arrival when mentioned in GC",
    longDescription: "Replies when owner is mentioned and collects reason to notify owner upon arrival",
    category: "system",
    guide: ""
  },

  onStart: async function () {
    // No manual trigger required
  },

  onChat: async function ({ api, event, message }) {
    const { threadID, senderID, mentions } = event;
    const ownerUID = "61591534221882"; // OWNER EMON UID

    const mentionData = getMentionData();
    if (!mentionData[threadID]) {
      mentionData[threadID] = [];
    }

    // 1. WHEN OWNER MESSAGES IN THE GROUP
    if (senderID === ownerUID) {
      const pendingMentions = mentionData[threadID];

      if (pendingMentions && pendingMentions.length > 0) {
        let mentionsArray = [{ tag: "@Emon Sir", id: ownerUID }];

        let welcomeText = `👑 ─────────────────────── 👑\n  👑 𝗠𝗜𝗠𝗜 𝗥 𝗛𝗨𝗦𝗕𝗔𝗡𝗗 👑\n👑 ─────────────────────── 👑\n\n`;
        welcomeText += `𝗠𝘆 𝗕𝗲𝘀𝘁 𝗢𝘄𝗻𝗲𝗿 @Emon Sir,\nআপনি গ্রুপে অনুপস্থিত থাকাকালীন সময়ে আপনাকে ডাকার কারণ নিচে উল্লেখ করা হলো:\n\n`;
        welcomeText += `━━━━━━━ [ 📋 𝗠𝗘𝗡𝗧𝗜𝗢𝗡 𝗟𝗜𝗦𝗧 ] ━━━━━━━\n\n`;

        for (let index = 0; index < pendingMentions.length; index++) {
          const item = pendingMentions[index];
          let userName = "Member";
          try {
            const userInfo = await api.getUserInfo(item.userID);
            if (userInfo[item.userID]) userName = userInfo[item.userID].name;
          } catch (e) {}

          const digits = ["❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿"];
          const numSymbol = digits[index] || `${index + 1}.`;

          welcomeText += `${numSymbol} 👤 𝗠𝗲𝗺𝗯𝗲𝗿: @${userName}\n`;
          welcomeText += `   💬 𝗥𝗲𝗮𝘀𝗼𝗻: ${item.reason}\n`;
          welcomeText += `   ⏰ 𝗧𝗶𝗺𝗲: ${item.time}\n\n`;

          mentionsArray.push({ tag: `@${userName}`, id: item.userID });
        }

        welcomeText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n Sir, I have delivered all messages to you successfully!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n𝗧𝗛𝗜𝗦 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗠𝗬 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;

        // Clear recorded mentions for this group
        mentionData[threadID] = [];
        saveMentionData(mentionData);

        return message.reply({
          body: welcomeText,
          mentions: mentionsArray
        });
      }
      return;
    }

    // 2. WHEN SOMEONE MENTIONS OWNER
    if (mentions && mentions[ownerUID]) {
      const responseMsg = `╭┉┉┅┄┄•◦ೋ•◦❥•◦ೋ___________________/////
    
𝗞𝗶 𝗯𝗼𝗹𝗯𝗮 𝗔𝗺𝗸 𝗕𝗼𝗹𝗼 𝗔𝗺𝗶 𝗔𝗺𝗿 𝗢𝘄𝗡𝗲𝗿 𝗞𝗲 𝗯𝗼𝗹𝗲 𝗱𝗶𝗯𝗼 𝗦𝗲 𝗚𝗿𝗼𝘂𝗽 𝗮 𝗢𝗻𝗹𝗶𝗻𝗲 𝗮𝘀𝗮𝗿 𝘀𝗮𝘁𝗵𝗲 𝘀𝗮𝘁𝗵𝗲..!! 
•◦ೋ•◦❥•◦ೋ•┈┄┄┅┉----------------------///
𝗘𝗺𝗼𝗻 𝗴𝗮𝘃𝗲 𝗺𝗲 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝘁𝗼 𝗱𝗼 𝘀𝗼`;

      return message.reply(responseMsg, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "ownermention",
          messageID: info.messageID,
          callerID: senderID
        });
      });
    }
  },

  // 3. WHEN USER REPLIES WITH REASON
  onReply: async function ({ api, event, Reply, message }) {
    const { threadID, senderID, body } = event;

    if (senderID !== Reply.callerID) return;

    const mentionData = getMentionData();
    if (!mentionData[threadID]) {
      mentionData[threadID] = [];
    }

    const now = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: '2-digit', minute: '2-digit' });

    mentionData[threadID].push({
      userID: senderID,
      reason: body || "No reason specified",
      time: now
    });

    saveMentionData(mentionData);

    return message.reply("✅ 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂! 𝗜 𝗵𝗮𝘃𝗲 𝘀𝗮𝘃𝗲𝗱 𝘆𝗼𝘂𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲/𝗿𝗲𝗮𝘀𝗼𝗻. 𝗜 𝘄𝗶𝗹𝗹 𝗶𝗻𝗳𝗼𝗿𝗺 𝗺𝘆 𝗼𝘄𝗻𝗲𝗿 𝗮𝘀 𝘀𝗼𝗼𝗻 𝗮𝘀 𝗵𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽!");
  }
};
