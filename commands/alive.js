/// Copyright @(hank!nd3 p4d4y41!
const os = require('os');
const settings = require('../config');

/**
 * സെക്കന്റുകളെ മണിക്കൂർ/മിനിറ്റ് രൂപത്തിലേക്ക് മാറ്റുന്നു
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function aliveCommand(sock, chatId, message) {
    try {
        const uptime = runtime(process.uptime());
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        
        const aliveMsg = `╭───────────────┈⊷
│ 🤖 *LIZA-AI IS ONLINE*
╰───────────────┈⊷
│
│ 👤 *Developer:* (hank!nd3 p4d4y41!)
│ ⏳ *Uptime:* ${uptime}
│ 📟 *RAM:* ${ramUsage}MB / ${totalRam}GB
│ 📡 *Status:* Connected
│ 🛠️ *Version:* 2.0.0
│
╰───────────────┈⊷
      *Type .menu to see all commands*`;

        await sock.sendMessage(chatId, {
            text: aliveMsg,
            contextInfo: {
                externalAdReply: {
                    title: "LIZA-AI MD STATUS",
                    body: "Smart WhatsApp Assistant",
                    thumbnailUrl: "https://telegra.ph/file/your-image-link.jpg", // ഇവിടെ നിങ്ങളുടെ ലോഗോ ലിങ്ക് നൽകാം
                    sourceUrl: "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A",
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI (hank!nd3 p4d4y41!)',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '🤖 LIZA-AI is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
