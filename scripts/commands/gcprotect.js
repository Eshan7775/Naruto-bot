const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const protectFile = path.join(cacheDir, "gcprotect.json");

function getProtectData() {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  if (!fs.existsSync(protectFile)) fs.writeFileSync(protectFile, "{}");
  return fs.readJsonSync(protectFile);
}

function saveProtectData(data) {
  fs.writeJsonSync(protectFile, data, { spaces: 2 });
}

module.exports = {
  config: {
    name: "gc",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 0,
    shortDescription: "Group Protection System",
    longDescription: "Protect GC settings and auto-remove abusive members",
    category: "group",
    guide: "{pn} protect on | {pn} protect off | {pn} logs"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const action = args[0] ? args[0].toLowerCase() : "";
    const option = args[1] ? args[1].toLowerCase() : "";

    const data = getProtectData();
    if (!data[threadID]) {
      data[threadID] = { status: false, removedLogs: [] };
    }

    if (action === "protect") {
      if (option === "on") {
        data[threadID].status = true;
        saveProtectData(data);
        return message.reply("🛡️ [ GC PROTECT ON ]\nGroup protection system enabled successfully! Security settings are now active.");
      } else if (option === "off") {
        data[threadID].status = false;
        saveProtectData(data);
        return message.reply("⚠️ [ GC PROTECT OFF ]\nGroup protection system has been disabled.");
      } else {
        return message.reply("⚠️ Invalid usage! Correct format: !gc protect on OR !gc protect off");
      }
    }

    if (action === "logs") {
      const logs = data[threadID].removedLogs || [];
      if (logs.length === 0) {
        return message.reply("📋 No members have been removed yet.");
      }

      let logText = `📋 [ REMOVED MEMBERS LOG ]\n━━━━━━━━━━━━━━━\n`;
      logs.forEach((log, index) => {
        logText += `${index + 1}. UID: ${log.uid}\n   Reason: ${log.reason}\n   Time: ${log.time}\n\n`;
      });
      logText += `━━━━━━━━━━━━━━━\n𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;
      return message.reply(logText);
    }

    return message.reply("⚠️ Usage guide:\n• !gc protect on\n• !gc protect off\n• !gc logs");
  },

  onChat: async function ({ api, event, message }) {
    const { threadID, senderID, body } = event;
    if (!body) return;

    const ownerUID = "61591534221882"; // OWNER EMON UID
    const gfUID = "GF_UID_HERE";      // GF / Bhabhi UID

    const data = getProtectData();
    if (!data[threadID] || !data[threadID].status) return;

    // Skip checking for Owner and GF
    if (senderID === ownerUID || senderID === gfUID) return;

    // Filtered bad words list
    const badWords = [
      "madarchod", 
      "madarcd", 
      "tor ma re cdi", 
      "kankir pola", 
      "magi", 
      "mg", 
      "vudai", 
      "bainchod"
    ];

    const messageContent = body.toLowerCase();
    const hasBadWord = badWords.some((word) => messageContent.includes(word));

    if (hasBadWord) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
        data[threadID].removedLogs.push({
          uid: senderID,
          reason: "Used abusive/prohibited language",
          time: now
        });
        saveProtectData(data);

        message.send(`🚫 User (${senderID}) was automatically removed for using inappropriate language!`);
      } catch (err) {
        console.error("Failed to remove user:", err);
      }
    }
  }
};
