const fs = require("fs");

// Load FCA module
const fcaModule = require("fca-liane-utils");

// Resolve the actual login function dynamically
const login = typeof fcaModule === "function" 
  ? fcaModule 
  : (fcaModule && typeof fcaModule.login === "function" 
      ? fcaModule.login 
      : (fcaModule && fcaModule.default ? (typeof fcaModule.default === "function" ? fcaModule.default : fcaModule.default.login) : null));

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
  console.error("❌ Login function resolution failed. fcaModule contents:", typeof fcaModule, fcaModule);
  process.exit(1);
}

// Execute Facebook Login
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
