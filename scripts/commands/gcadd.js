const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const pendingFile = path.join(cacheDir, "pendingGroups.json");

function getPendingData() {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  if (!fs.existsSync(pendingFile)) fs.writeFileSync(pendingFile, "{}");
  return fs.readJsonSync(pendingFile);
}

function savePendingData(data) {
  fs.writeJsonSync(pendingFile, data, { spaces: 2 });
}

module.exports = {
  config: {
    name: "gcadd",
    version: "2.1.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 1, // Only Owner & Sub-Admins
    shortDescription: "Manage bot group join requests easily by replying numbers",
    longDescription: "View pending groups and approve/reject by replying to the list message with numbers",
    category: "admin",
    guide: "{pn} pending"
  },

  onStart: async function ({ api, event, message }) {
    const data = getPendingData();
    const keys = Object.keys(data);

    if (keys.length === 0) {
      return message.reply("📋 [ PENDING REQUESTS ]\nNo pending group requests found at the moment.");
    }

    let requestList = `📋 [ PENDING GROUP REQUESTS: ${keys.length} ]\n━━━━━━━━━━━━━━━\n\n`;
    
    keys.forEach((threadID, index) => {
      const info = data[threadID];
      requestList += `${index + 1}. Group Name: ${info.name}\n   Members: ${info.members}\n   Thread ID: ${threadID}\n\n`;
    });

    requestList += `━━━━━━━━━━━━━━━\n💡 HOW TO APPROVE / REJECT:\n`;
    requestList += `• Reply to this message with just number (e.g., "1") to APPROVE.\n`;
    requestList += `• Reply with "reject 1" to REJECT.\n\n`;
    requestList += `𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;

    return message.reply(requestList, (err, info) => {
      if (err) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "gcadd",
        messageID: info.messageID,
        author: event.senderID,
        pendingList: keys
      });
    });
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { author, pendingList } = Reply;
    const { senderID, body } = event;

    if (senderID !== author) return;

    const input = body.trim().toLowerCase();
    const data = getPendingData();

    let isReject = false;
    let targetIndexStr = input;

    if (input.startsWith("reject ")) {
      isReject = true;
      targetIndexStr = input.replace("reject ", "").trim();
    }

    const index = parseInt(targetIndexStr) - 1;

    if (isNaN(index) || index < 0 || index >= pendingList.length) {
      return message.reply("❌ Invalid selection number! Please enter a valid serial number from the list.");
    }

    const targetThreadID = pendingList[index];

    if (!data[targetThreadID]) {
      return message.reply("❌ This group request is no longer active.");
    }

    delete data[targetThreadID];
    savePendingData(data);

    if (isReject) {
      try {
        await api.sendMessage(
          "❌ [ ACCESS DENIED ]\nThis group request was declined by the Bot Owner. Leaving group...",
          targetThreadID
        );
        await api.removeUserFromGroup(api.getCurrentUserID(), targetThreadID);
        return message.reply(`🗑️ Success! Group Serial #${index + 1} (${targetThreadID}) has been rejected and bot left.`);
      } catch (err) {
        return message.reply(`❌ Rejected, but error occurred while leaving group (${targetThreadID}).`);
      }
    } else {
      try {
        const welcomeMessage = `✨ [ BOT IS NOW ACTIVE ] ✨\n━━━━━━━━━━━━━━━\nHello Everyone! 👋\nThis group has been officially approved by OWNER EMON.\nType !help to see all commands!\n━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡\n𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗜𝗱 : شفاعة آسيا`;

        await api.sendMessage(welcomeMessage, targetThreadID);
        return message.reply(`✅ Success! Group Serial #${index + 1} (${targetThreadID}) has been approved successfully!`);
      } catch (err) {
        return message.reply(`❌ Approved, but failed to send welcome message to group (${targetThreadID}).`);
      }
    }
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
      const addedParticipants = event.logMessageData.addedParticipants || [];
      const botID = api.getCurrentUserID();

      const isBotAdded = addedParticipants.some((user) => user.userFbId === botID);

      if (isBotAdded) {
        const threadID = event.threadID;
        try {
          const threadInfo = await api.getThreadInfo(threadID);
          const data = getPendingData();

          data[threadID] = {
            name: threadInfo.threadName || "Unknown Group Name",
            members: threadInfo.participantIDs ? threadInfo.participantIDs.length : 0,
            addedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
          };

          savePendingData(data);

          await api.sendMessage(
            "⏳ [ APPROVAL REQUIRED ]\nHello! I have joined this group, but system requires Owner approval to function.\nPending approval request sent to Admin.",
            threadID
          );
        } catch (err) {
          console.error("Error logging group add event:", err);
        }
      }
    }
  }
};
