const express = require("express");
const fs = require("fs");
const path = require("path");
const login = require("fca-eryxenx");

// Web Server for Railway Health Check
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Naruto Bot is Running Online!");
});

app.listen(port, () => {
  console.log(`[ SERVER ] Uptime server running on port ${port}`);
});

// Get AppState from Railway Variables or File
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

// Start Goat Bot Engine
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
    listenTyping: false,
    autoMarkDelivery: false
  });

  // Main Event Listener
  api.listenMqtt((err, event) => {
    if (err) {
      console.error("❌ MQTT Listen Error:", err);
      return;
    }

    // Pass event to GoatBot core handler if index.js or scripts exist
    try {
      if (event.type === "message" || event.type === "message_reply") {
        const body = event.body ? event.body.trim() : "";

        // Direct response test
        if (body.toLowerCase() === "/ping" || body.toLowerCase() === "ping") {
          api.sendMessage("Pong! 🏓 Naruto Bot is active in this Group Chat!", event.threadID, event.messageID);
        }

        if (body.toLowerCase() === "/help" || body.toLowerCase() === "help") {
          api.sendMessage("✨ Naruto Bot System Active!\nType /ping to test connection.", event.threadID, event.messageID);
        }
      }
    } catch (e) {
      console.error("❌ Message Processing Error:", e.message);
    }
  });
});
