const login = require("fca-unofficial");
const fs = require("fs");
const axios = require("axios");

// 1. Bot Prefix
const PREFIX = "!"; 

// 2. Main Owner UID
const OWNER_UID = "61591534221882"; 

// 3. OWNER EMON's GF UID (Poron Uid ekhane bosiye nio)
const GF_UID = "YOUR_GF_UID_HERE"; 

// Files to store states dynamically
const ADMINS_FILE = "sub_admins.json";
const STATUS_FILE = "bot_status.json";

// Murgi command control variables
let murgiIntervals = {}; 

// Load Sub-Admins
let SUB_ADMINS = [];
if (fs.existsSync(ADMINS_FILE)) {
    try { SUB_ADMINS = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8')); } catch (e) { SUB_ADMINS = []; }
} else { fs.writeFileSync(ADMINS_FILE, JSON.stringify([]), 'utf8'); }

// Load Bot On/Off Status
let isBotActive = true;
if (fs.existsSync(STATUS_FILE)) {
    try { isBotActive = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8')).active; } catch (e) { isBotActive = true; }
} else { fs.writeFileSync(STATUS_FILE, JSON.stringify({ active: true }), 'utf8'); }

const credentials = { appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) };

// Helper function to get Bangladesh Time string
function getBDTime() {
    const options = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return new Date().toLocaleTimeString('en-US', options);
}

const loginOptions = { userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36" };
login(credentials, loginOptions, (err, api) => {

    console.log("Bot successfully logged in and waiting for 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡! 🚀");

    api.listenMqtt((err, message) => {
        if(err) return console.error(err);
        if(!message.body) return;

        const msg = message.body.trim();
        const isOwner = message.senderID === OWNER_UID;

        // 🛑 MASTER CONTROL: Bot On/Off Check
        if (!isBotActive && !isOwner) return;

        const isGF = message.senderID === GF_UID;
        
        // 👑 GF / Bhabhi Special Flirting System
        if (isGF) {
            const bhabhiReplies = [
                "Assalamu Alaikum Bhabhi! 🥰 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 er chokh faki diye amar sathe ektu golpo korben? Apnake dekhle amar artificial heart-eo bell baje! 🙈",
                "Uff Bhabhi! Apnar emoji deya dekhe to amar full system hang hoye gelo! 😍 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 bhai ekhon koi? O ke faki diye cholen amra ektu flirtting kori? 😉",
                "Walaikum Assalam Bhabhi (agei diye rakhlam)! Apni eto shundor keno bolen to? 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡 bhai sotti ekaaai lucky! Ektu amakeo valobashun na! 😘",
                "Bhabhiii! 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡 bhai jodi ekhon thakto, tahole apnake niye romantic kobita likhto. Kintu o to nai, cholen ami e apnake ektu buttering kori? 🤪❤️"
            ];
            const randomReply = bhabhiReplies[Math.floor(Math.random() * bhabhiReplies.length)];
            return api.sendMessage(randomReply, message.threadID);
        }

        // Cute Girl Character Greeting
        if (msg.toLowerCase() === "hi" || msg.toLowerCase() === "hello" || msg.toLowerCase() === "কিরে") {
            return api.sendMessage("Hello! Ami 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡 er toiri kora robot meye. Kemon achen bolun? 🥰", message.threadID);
        }

        // Processing Commands
        if (msg.startsWith(PREFIX)) {
            const args = msg.slice(PREFIX.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const isSubAdmin = SUB_ADMINS.includes(message.senderID);

            // 📢 1. !notification Command (𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 Only)
            if (command === "notification" || command === "notice") {
                if (!isOwner) return api.sendMessage("❌ Access Denied! Ei broadcast command shudhu 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 use korte parbe. 😎", message.threadID);
                
                const noticeText = args.join(" ");
                if (!noticeText) return api.sendMessage("💡 Niyom: !notification [Apnar Notice Ekhane]", message.threadID);

                api.sendMessage("Shob gup e notification pathano shuru hocche... ⏱️", message.threadID);

                // Fetching all chats/groups bot is in
                api.getThreadList(100, null, ["INBOX"], (err, list) => {
                    if (err) return api.sendMessage("❌ Error fetching group list!", message.threadID);

                    // Filter only group chats
                    const groupThreads = list.filter(thread => thread.isGroup);
                    
                    if (groupThreads.length === 0) return api.sendMessage("Bot to kono group e add nai! 🧐", message.threadID);

                    const currentTime = getBDTime();

                    // Beautiful design formatting
                    let fullNotice = `╭━━━〔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡  〕━━━╮\n`;
                    fullNotice += `│ 𝐎𝐖𝐍𝐄𝐑 : 𝐄𝐒𝐇𝐘𝐀 𝐑 𝐇𝐔𝐒𝐁𝐀𝐍𝐃\n`;
                    fullNotice += `│𝐑𝐄𝐀𝐋 𝐍𝐀𝐌𝐄 : 𝐄𝐌𝐎𝐍 𝐈𝐒𝐋𝐀𝐌\n`;
                    fullNotice += `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
                    fullNotice += `🕒 Time: ${currentTime}\n`;
                    fullNotice += ` 　　　 ∩　 ∩\n`;
                    fullNotice += `　　　 (๑＾◡＾๑)\n`;
                    fullNotice += `┏♪━･━〇━･〇･━+☆+┓\n`;
                    fullNotice += `    𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 \n`;
                    fullNotice += `┗+☆+━･━･━ + ━･━♬┛\n\n`;
                    fullNotice += `⤹˚˖♬୭ ♡\n`;
                    fullNotice += `---------────────🦋---------────────\n\n`;
                    fullNotice += `${noticeText}\n\n`; // Your text adjusts here perfectly
                    fullNotice += `-------------˖⁺. ༶ ⋆˙⊹❀♡❀˖⁺. ༶ ⋆˙⊹-------------`;

                    // Send notice to all groups
                    let successCount = 0;
                    groupThreads.forEach(group => {
                        api.sendMessage(fullNotice, group.threadID, (sendErr) => {
                            if (!sendErr) successCount++;
                        });
                    });

                    // Update owner after sending
                    setTimeout(() => {
                        api.sendMessage(`✅ Total ${successCount} ti group e successfully notification pathano hoyeche!`, message.threadID);
                    }, 3000);
                });
            }

            // 🐔 !murgi & !murgi off Command (𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 Only)
            if (command === "murgi") {
                if (!isOwner) return api.sendMessage("❌ Access Denied! 😎", message.threadID);
                const subCmd = args[0] ? args[0].toLowerCase() : "";
                
                if (subCmd === "off") {
                    if (murgiIntervals[message.threadID]) {
                        clearInterval(murgiIntervals[message.threadID]);
                        delete murgiIntervals[message.threadID];
                        return api.sendMessage("✅ Murgi roast kora bondho holo! 🥶", message.threadID);
                    } else {
                        return api.sendMessage("Kono active murgi to nai ekhon! 🧐", message.threadID);
                    }
                }

                const mentions = message.mentions;
                if (!mentions || Object.keys(mentions).length === 0) return api.sendMessage("💡 Niyom: !murgi @mention", message.threadID);
                if (murgiIntervals[message.threadID]) return api.sendMessage("Already ekta murgi roast hocche! 🐔", message.threadID);

                const targetUID = Object.keys(mentions)[0];
                const targetName = mentions[targetUID].replace("@", "");

                const roastGalis = [
                    `Oi ${targetName}, tui to ekta numbar one er murgi! 🐔`,
                    `Oi ${targetName}, tor mathay ki gubor vora? Kotha bolish na batpar! 🤥`,
                    `Are ${targetName}, tor moto abal ami ekhono dekhi nai! 🥱`,
                    `Oi ${targetName}, 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 er bot er sathe panga nitesos? Tor aukaad nai! 😏`
                ];

                api.sendMessage(`🔥 Murgi roast mission shuru holo! Target: ${targetName} 😈`, message.threadID);

                murgiIntervals[message.threadID] = setInterval(() => {
                    const randomRoast = roastGalis[Math.floor(Math.random() * roastGalis.length)];
                    api.sendMessage({ body: randomRoast, mentions: [{ tag: targetName, id: targetUID }] }, message.threadID);
                }, 2500); 
            }

            // 🔋 Bot On/Off Commands (𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 Only)
            if (command === "bot") {
                if (!isOwner) return api.sendMessage("❌ Access Denied! 😎", message.threadID);
                const subCmd = args[0] ? args[0].toLowerCase() : "";
                if (subCmd === "off") {
                    isBotActive = false;
                    fs.writeFileSync(STATUS_FILE, JSON.stringify({ active: false }), 'utf8');
                    return api.sendMessage("🛑 Bot OFF kora holo!", message.threadID);
                } else if (subCmd === "on") {
                    isBotActive = true;
                    fs.writeFileSync(STATUS_FILE, JSON.stringify({ active: true }), 'utf8');
                    return api.sendMessage("🔋 Bot ON kora holo! 🥰", message.threadID);
                }
            }

            // 👑 Admin Management via Mention (𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 Only)
            if (command === "admin") {
                if (!isOwner) return api.sendMessage("❌ Access Denied! 😎", message.threadID);
                const subCmd = args[0] ? args[0].toLowerCase() : "";
                const mentions = message.mentions;
                if (!subCmd || !mentions || Object.keys(mentions).length === 0) return api.sendMessage("💡 Niyom: !admin add/remove @mention", message.threadID);

                const targetUID = Object.keys(mentions)[0];
                const targetName = mentions[targetUID].replace("@", "");

                if (subCmd === "add") {
                    if (SUB_ADMINS.includes(targetUID)) return api.sendMessage(`${targetName} to age thekei Sub-Admin! 😮`, message.threadID);
                    SUB_ADMINS.push(targetUID);
                    fs.writeFileSync(ADMINS_FILE, JSON.stringify(SUB_ADMINS, null, 2), 'utf8');
                    return api.sendMessage(`✅ ${targetName} ke successfully Sub-Admin banalo 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡!`, message.threadID);
                } 
                if (subCmd === "remove") {
                    if (!SUB_ADMINS.includes(targetUID)) return api.sendMessage(`${targetName} to Sub-Admin list ei nai! 🧐`, message.threadID);
                    SUB_ADMINS = SUB_ADMINS.filter(id => id !== targetUID);
                    fs.writeFileSync(ADMINS_FILE, JSON.stringify(SUB_ADMINS, null, 2), 'utf8');
                    return api.sendMessage(`❌ ${targetName} ke Sub-Admin list theke shoriye dilo 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡!`, message.threadID);
                }
            }

            // 👑 Admin List Command
            if (command === "adminlist") {
                let replyMsg = "👑 **BOT ADMIN LIST** 👑\n\n👤 **Main Admin:**\n➔ 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡\n\n🛠️ **Sub-Admins:**\n";
                if (SUB_ADMINS.length === 0) replyMsg += "➔ Kono sub-admin set kora nai.";
                else SUB_ADMINS.forEach((admin, i) => { replyMsg += `➔ Admin ${i + 1}: (UID: ${admin})\n`; });
                return api.sendMessage(replyMsg, message.threadID);
            }

            // 🎮 !ffpp - Free Fire Profile
            if (command === "ffpp") {
                const ffUID = args[0];
                if (!ffUID) return api.sendMessage("💡 Niyom: !ffpp [Free_Fire_UID]", message.threadID);
                api.sendMessage("Chotto ekta break nin, ami data khuje ber korchi... ⏱️", message.threadID);
                axios.get(`https://freefire-api.vercel.app/api/player?id=${ffUID}`)
                    .then(res => {
                        const data = res.data;
                        if (!data || data.error) return api.sendMessage("❌ Data pawa jayni.", message.threadID);
                        api.sendMessage(`🎮 **FREE FIRE PROFILE** 🎮\n\n📝 **Name:** ${data.name}\n🆔 **UID:** ${data.id}\n📊 **Level:** ${data.level}\n❤️ **Likes:** ${data.likes}\n\n🤖 *Ami 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡 er sweet bot!*`, message.threadID);
                    }).catch(() => api.sendMessage("⚠️ Server busy!", message.threadID));
            }

            // 👤 !uid - Get Mentioned UID
            if (command === "uid") {
                const mentions = message.mentions;
                if (!mentions || Object.keys(mentions).length === 0) return api.sendMessage(`👤 Apnar FB UID: ${message.senderID}`, message.threadID);
                let mentionMsg = "🆔 **MENTIONED USERS UID** 🆔\n\n";
                for (const id in mentions) { mentionMsg += `➔ ${mentions[id].replace("@", "")}: ${id}\n`; }
                return api.sendMessage(mentionMsg, message.threadID);
            }

            // 📜 Help Command
            if (command === "help" || command === "menu") {
                let helpMsg = "📜 **AVAILABLE COMMANDS LIST** 📜\n\n⚙️ **General:**\n➔ !help, !adminlist, !uid @mention, !ffpp [UID]\n\n🛠️ **Sub-Admin:**\n➔ !warn\n\n👑 **Owner Only:**\n➔ !bot on / !bot off\n➔ !admin add / remove @mention\n➔ !murgi @mention / !murgi off 🐔\n➔ !notification [text] 📢\n➔ !eval [code], !restart\n\n🤖 *Ami ekta robot meye, 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 er bot!*";
                return api.sendMessage(helpMsg, message.threadID);
            }

            // 🛑 Master Command for 𝗢𝗪𝗡𝗘Ｒ 𝗘𝗠𝗢𝗡 Only
            if (command === "eval") {
                if (!isOwner) return api.sendMessage("❌ Access Denied! 😎", message.threadID);
                const code = args.join(" ");
                try {
                    let evaled = eval(code);
                    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                    api.sendMessage(`✅ Output:\n${evaled}`, message.threadID);
                } catch (err) { api.sendMessage(`❌ Error:\n${err.message}`, message.threadID); }
            }

            // 🔄 Restart Command for 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡 Only
            if (command === "restart") {
                if (!isOwner) return;
                api.sendMessage("Ami restart hocchi 𝗢𝗪𝗡ＥＲ 𝗘𝗠𝗢𝗡, 1 minute por ashchi... 🔄", message.threadID, () => { process.exit(1); });
            }
        }
    });
});
