const express = require("express");
const fs = require("fs");
const fca = require("fca-liane-utils");
const goat = require("./Goat");

// Handle module exports safely
const login = typeof fca === "function" ? fca : (fca.default || fca.login || fca);

const app = express();
const port = process.env.PORT || 3000;

// Server Uptime Health Check
app.get("/", (req, res) => {
  res.send("Naruto Bot is Running Online 24/7!");
});

app.listen(port, () => {
  console.log(`[ SERVER ] Uptime server running on port ${port}`);
});

// AppState / Cookie Loader Function
function getAppState() {
  if (process.env.APPSTATE) {
    try {
      return JSON.parse(process.env.APPSTATE);
    } catch (e) {
      console.error("❌ Failed to parse APPSTATE environment variable:", e.message);
    }
  }
  
  if (fs.existsSync("./account.txt")) {
    try {
      return JSON.parse(fs.readFileSync("./account.txt", "utf8"));
    } catch (e) {
      console.error("❌ Failed to parse account.txt:", e.message);
    }
  }
  
  return null;
}

const appState = getAppState();

if (!appState) {
  console.error("❌ No valid AppState found in Railway Variables or account.txt!");
  process.exit(1);
}

// Login to Facebook
login({ appState }, (err, api) => {
  if (err) {
    console.error("❌ Facebook Login Failed:", err);
    return;
  }

  console.log("✅ Naruto Bot Successfully Logged in to Facebook!");

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    forceLogin: true
  });

  api.listenMqtt((err, event) => {
    if (err) {
      console.error("❌ MQTT Listen Error:", err);
      return;
    }
    goat({ api, event });
  });
});
