/**
 * Project: Naruto Goat Bot V2
 * Author: OWNER EMON
 */

const { spawn } = require("child_process");
const express = require("express");

// Express Uptime Server
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Naruto Goat Bot is running!");
});

app.listen(port, () => {
    console.log(`[ SERVER ] Uptime server running on port ${port}`);
});

// GoatBot Main Engine Launcher
function startBot() {
    const child = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code === 2) {
            console.log("[ SYSTEM ] Restarting Bot...");
            startBot();
        } else {
            console.log(`[ SYSTEM ] Bot stopped with code: ${code}`);
        }
    });

    child.on("error", (err) => {
        console.error("[ ERROR ] Failed to start child process:", err);
    });
}

// Start Process
startBot();
