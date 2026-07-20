const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "say",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 0,
    shortDescription: "Text to Speech in female Bengali voice",
    longDescription: "Converts provided text into a female voice message (audio response)",
    category: "utility",
    guide: "{pn} [text]"
  },

  onStart: async function ({ api, event, args, message }) {
    const text = args.join(" ");

    if (!text) {
      return message.reply("⚠️ Please provide some text to convert to voice!\nExample: !say kemon acho sobai");
    }

    const cachePath = path.join(__dirname, "cache", `say_${event.senderID}_${Date.now()}.mp3`);

    try {
      // Google Text-To-Speech (Female Bengali Voice)
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=bn&client=tw-ob`;

      const response = await axios({
        method: "GET",
        url: ttsUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          attachment: fs.createReadStream(cachePath)
        });

        // Delete cache file after sending audio
        if (fs.existsSync(cachePath)) {
          fs.unlinkSync(cachePath);
        }
      });

      writer.on("error", (err) => {
        console.error("Audio stream error:", err);
        return message.reply("❌ Failed to generate audio message.");
      });

    } catch (error) {
      console.error("TTS API Error:", error);
      return message.reply("❌ Error generating voice audio. Please try again later!");
    }
  }
};
