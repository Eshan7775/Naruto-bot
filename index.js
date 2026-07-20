const { spawn } = require("child_process");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Naruto Bot is Online 24/7!");
});

app.listen(port, () => {
  console.log(`[ SERVER ] Uptime server running on port ${port}`);
});

function startBot() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code === 2) {
      console.log("[ SYSTEM ] Restarting Bot Process...");
      startBot();
    }
  });
}

startBot();
