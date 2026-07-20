const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    author: "OWNER EMON",
    countDown: 2,
    role: 2, // 2 = Only Main Bot Owner can use this
    shortDescription: "Manage sub-admins",
    longDescription: "Add or remove sub-admins using mentions",
    category: "admin",
    guide: "{pn} add @mention OR {pn} remove @mention"
  },

  onStart: async function ({ api, event, args, message }) {
    const { mentions, senderID } = event;
    const action = args[0] ? args[0].toLowerCase() : "";

    // Config path
    const configPath = path.join(__dirname, "../../config.json");
    let configData;

    try {
      configData = fs.readJsonSync(configPath);
    } catch (err) {
      return message.reply("❌ config.json ফাইলটি পড়তে সমস্যা হচ্ছে।");
    }

    // Ensure subAdminBot array exists
    if (!Array.isArray(configData.subAdminBot)) {
      configData.subAdminBot = [];
    }

    // Check action type
    if (action === "add") {
      const mentionIDs = Object.keys(mentions);
      if (mentionIDs.length === 0) {
        return message.reply("⚠️ যাকে সাব-অ্যাডমিন বানাতে চান, তাকে মেনশন করুন।\nউদাহরণ: !admin add @user");
      }

      let addedNames = [];
      for (const id of mentionIDs) {
        if (!configData.subAdminBot.includes(id)) {
          configData.subAdminBot.push(id);
          addedNames.push(mentions[id].replace("@", ""));
        }
      }

      if (addedNames.length === 0) {
        return message.reply("⚠️ এই ব্যবহারকারী ইতোমধ্যে সাব-অ্যাডমিন তালিকায় আছেন।");
      }

      fs.writeJsonSync(configPath, configData, { spaces: 2 });
      return message.reply(`✅ સફળভাবে সাব-অ্যাডমিন যুক্ত করা হয়েছে: ${addedNames.join(", ")}`);
    } 
    
    else if (action === "remove") {
      const mentionIDs = Object.keys(mentions);
      if (mentionIDs.length === 0) {
        return message.reply("⚠️ যাকে সাব-অ্যাডমিন থেকে সরাতে চান, তাকে মেনশন করুন।\nউদাহরণ: !admin remove @user");
      }

      let removedNames = [];
      for (const id of mentionIDs) {
        const index = configData.subAdminBot.indexOf(id);
        if (index !== -1) {
          configData.subAdminBot.splice(index, 1);
          removedNames.push(mentions[id].replace("@", ""));
        }
      }

      if (removedNames.length === 0) {
        return message.reply("⚠️ উক্ত ব্যবহারকারী সাব-অ্যাডমিন তালিকায় নেই।");
      }

      fs.writeJsonSync(configPath, configData, { spaces: 2 });
      return message.reply(`🗑️ সাব-অ্যাডমিন তালিকা থেকে সরানো হয়েছে: ${removedNames.join(", ")}`);
    } 
    
    else {
      return message.reply("⚠️ সঠিক নিয়ম:\n• !admin add @user\n• !admin remove @user");
    }
  }
};
