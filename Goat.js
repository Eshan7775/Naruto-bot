const express = require("express");
const fs = require("fs");
const login = require("fca-eryxenx");

function getAppState() {
  if (process.env.APPSTATE) {
    try {
      return JSON.parse(process.env.APPSTATE);
    } catch (e) {
      console.error("❌ AppState Parsing Error:", e.message);
    }
  }
  
  if (fs.existsSync("./account.txt")) {
    try {
      return JSON.parse(fs.readFileSync("./account.txt", "utf8"));
    } catch (e) {
      console.error("❌ account.txt Parsing Error:", e.message);
    }
  }
  
  return null;
}

const appState = getAppState();

if (!appState) {
  console.error("❌ No valid AppState found in Railway Variables or account.txt!");
  process.exit(1);
}

// Facebook Login
login({ appState }, (err, api) => {
  if (err) {
    console.error("❌ Facebook Login Failed:", err);
    return;
  }

  console.log("✅ Naruto Bot Successfully Logged in to Facebook!");

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    forceLogin: true,
    listenTyping: false
  });

  api.listenMqtt((err, event) => {
    if (err) {
      console.error("❌ MQTT Listen Error:", err);
      return;
    }

    if (event.type === "message" || event.type === "message_reply") {
      const body = event.body ? event.body.trim() : "";
      
      if (body.toLowerCase() === "/ping" || body.toLowerCase() === "ping") {
        api.sendMessage("Pong! 🏓 Naruto Bot is working fine!", event.threadID, event.messageID);
      }
      
      if (body.toLowerCase() === "/help") {
        api.sendMessage("✨ Naruto Messenger Bot Active!\nCommands:\n- /ping\n- /help", event.threadID, event.messageID);
      }
    }
  });
});
