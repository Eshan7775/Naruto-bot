module.exports = {
  config: {
    name: "bhabhi",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 0,
    shortDescription: "Special response for bhabhi",
    longDescription: "Automated respect and flirty responses for GF/Bhabhi",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    // Replacement: Add GF UID inside the quotes below
    const gfbhabhiUID = "GF_UID_HERE"; 

    if (event.senderID === gfbhabhiUID) {
      const flirtyReplies = [
        "Salam Bhabhi! Apnake dekhle amar artificial heart-ao bell baje! 🔔💖",
        "Emon Bhai er choice sotti oshadharon! Apnake dekhle puro group dhonno hoye jay! ✨",
        "Apni emne kotha bolle Emon bhai toh Emon bhai, amaro crush khete icche kore! 😉❤️"
      ];
      const randomReply = flirtyReplies[Math.floor(Math.random() * flirtyReplies.length)];
      return message.reply(randomReply);
    } else {
      return message.reply("Ei command shudhu Bhabhi-r jonno reserved! 😉");
    }
  }
};
