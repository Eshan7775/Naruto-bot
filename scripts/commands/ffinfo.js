const axios = require("axios");

module.exports = {
  config: {
    name: "ffinfo",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 3,
    role: 0,
    shortDescription: "Get Free Fire account information",
    longDescription: "Shows player profile info, ban status, headshot rate, and stats using Free Fire UID",
    category: "game",
    guide: "{pn} [UID] (Example: {pn} 123456789)"
  },

  onStart: async function ({ api, event, args, message }) {
    const uid = args[0];

    if (!uid) {
      return message.reply("⚠️ Please provide a valid Free Fire Player UID!\nExample: !ffinfo 123456789");
    }

    if (isNaN(uid)) {
      return message.reply("❌ Invalid UID! Free Fire UID must contain numbers only.");
    }

    try {
      message.reply("🔍 Fetching Free Fire player information, please wait...");

      // API request for Free Fire Profile Info & Ban Status
      const response = await axios.get(`https://free-fire-api-five.vercel.app/ff_info?uid=${uid}`);
      const data = response.data;

      if (!data || data.error || !data.basicInfo) {
        return message.reply("❌ Unable to find player details! Please check the UID and try again.");
      }

      const basic = data.basicInfo;
      const clan = data.clanBasicInfo || {};
      const social = data.socialInfo || {};

      // Ban status calculation
      const isBanned = basic.isBanned ? "🚫 YES (ACCOUNT BANNED)" : "✅ NO (ACCOUNT SAFE)";

      // Headshot rate calculation (if stats available)
      let headshotRate = "N/A";
      if (data.headshotRate) {
        headshotRate = `${data.headshotRate}%`;
      } else if (data.stats && data.stats.headshots && data.stats.kills) {
        const hs = (data.stats.headshots / data.stats.kills) * 100;
        headshotRate = `${hs.toFixed(2)}%`;
      }

      let infoText = `🎮 [ FREE FIRE PLAYER INFO ]\n━━━━━━━━━━━━━━━\n`;
      infoText += `👤 Name: ${basic.nickname || "N/A"}\n`;
      infoText += `🆔 UID: ${basic.accountId || uid}\n`;
      infoText += `⭐ Level: ${basic.level || "N/A"} (EXP: ${basic.exp || 0})\n`;
      infoText += `👍 Likes: ${basic.liked || 0}\n`;
      infoText += `🌍 Region: ${basic.region || "N/A"}\n`;
      infoText += `🛡️ Ban Status: ${isBanned}\n`;
      infoText += `🎯 Headshot Rate: ${headshotRate}\n`;
      infoText += `🏆 Rank Points: ${basic.rank || "N/A"}\n`;
      infoText += `🏰 Guild Name: ${clan.clanName || "No Guild"}\n`;
      infoText += `📅 Created At: ${basic.createAt ? new Date(basic.createAt * 1000).toLocaleDateString() : "N/A"}\n`;
      infoText += `📝 Bio: ${social.signature || "No Bio Set"}\n`;
      infoText += `━━━━━━━━━━━━━━━\n𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘 𝗕𝗬~ 𝗢𝗪𝗡𝗘𝗥 𝗘𝗠𝗢𝗡`;

      return message.reply(infoText);

    } catch (error) {
      console.error("FFInfo API Error:", error);
      return message.reply("❌ Server error or invalid UID! Could not retrieve player details.");
    }
  }
};
