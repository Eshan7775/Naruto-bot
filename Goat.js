const express = require("express");
const fs = require("fs");
const fca = require("fca-liane-utils");

// Safely extract the login function from fca module
let login;
if (typeof fca === "function") {
  login = fca;
} else if (fca && typeof fca.login === "function") {
  login = fca.login;
} else if (fca && fca.default && typeof fca.default === "function") {
  login = fca.default;
} else if (fca && fca.default && typeof fca.default.login === "function") {
  login = fca.default.login;
}

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

if (typeof login !== "function") {
  console.error("❌ Could not resolve login function from fca-liane-utils!");
  process.exit(1);
}

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
  });
});
