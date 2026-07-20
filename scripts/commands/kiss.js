const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "kiss",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 3,
    role: 0,
    shortDescription: "Kiss someone with an anime image edit",
    longDescription: "Creates an anime kiss image using sender and mentioned user profile pictures",
    category: "fun",
    guide: "{pn} @mention or reply to a user"
  },

  onStart: async function ({ api, event, message }) {
    const { mentions, senderID, type, messageReply } = event;
    let targetID;

    // 1. Get Target User ID
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else {
      const mentionIDs = Object.keys(mentions);
      if (mentionIDs.length > 0) {
        targetID = mentionIDs[0];
      }
    }

    if (!targetID) {
      return message.reply("⚠️ Please mention someone or reply to a message to kiss!\nExample: !kiss @user");
    }

    if (targetID === senderID) {
      return message.reply("😅 You can't kiss yourself!");
    }

    const cachePath = path.join(__dirname, "cache", `kiss_${senderID}_${targetID}.png`);

    try {
      message.reply("💋 Generating kiss image, please wait...");

      // Popcat Kiss API (Merges sender avatar on kisser & target avatar on kissee)
      const apiUrl = `https://api.popcat.xyz/kiss?avatar1=https://graph.facebook.com/${senderID}/picture?type=large&avatar2=https://graph.facebook.com/${targetID}/picture?type=large`;

      const response = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: `💋 Sending you a sweet kiss!\n━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`,
          attachment: fs.createReadStream(cachePath)
        });

        // Delete cached image after sending
        if (fs.existsSync(cachePath)) {
          fs.unlinkSync(cachePath);
        }
      });

      writer.on("error", (err) => {
        console.error("File stream error:", err);
        return message.reply("❌ Failed to generate kiss image.");
      });

    } catch (error) {
      console.error("Kiss API error:", error);
      return message.reply("❌ Error generating image. Please try again later!");
    }
  }
};
