const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 3,
    role: 0,
    shortDescription: "Slap someone with an anime image edit",
    longDescription: "Creates an anime slap image using sender and mentioned user profile pictures",
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
      return message.reply("⚠️ Please mention someone or reply to a message to slap!\nExample: !slap @user");
    }

    if (targetID === senderID) {
      return message.reply("😅 You can't slap yourself!");
    }

    const cachePath = path.join(__dirname, "cache", `slap_${senderID}_${targetID}.png`);

    try {
      message.reply("🖐️ Generating slap image, please wait...");

      // Canvas Slap API (Merges sender avatar on slapper & target avatar on slapped anime character)
      const apiUrl = `https://api.popcat.xyz/slap?avatar1=https://graph.facebook.com/${senderID}/picture?type=large&avatar2=https://graph.facebook.com/${targetID}/picture?type=large`;

      const response = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: `💥 Take this slap!\n━━━━━━━━━━━━━━━\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`,
          attachment: fs.createReadStream(cachePath)
        });

        // Delete cache image after sending
        if (fs.existsSync(cachePath)) {
          fs.unlinkSync(cachePath);
        }
      });

      writer.on("error", (err) => {
        console.error("File stream error:", err);
        return message.reply("❌ Failed to generate slap image.");
      });

    } catch (error) {
      console.error("Slap API error:", error);
      return message.reply("❌ Error generating image. Please try again later!");
    }
  }
};
