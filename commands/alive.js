/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, m) { // 'message' എന്നതിന് പകരം 'm' ആക്കി
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is running smoothly_\n\n` +
                         `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈  *Status:* Active\n` +
                         `◈  *Ver:* 3.0.0\n\n` +
                         `_Type .menu to see my power_`;

        // 🖼️ റെയിൽവേയിൽ ഫയൽ പാത്ത് ശരിയാക്കുന്നു
        const imagePath = path.join(process.cwd(), 'assets', 'bot_image.png');
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        let imageBuffer = null;
        try {
            if (fs.existsSync(imagePath)) {
                imageBuffer = fs.readFileSync(imagePath);
            }
        } catch (e) {
            console.log("Image read error:", e.message);
        }

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI ✅ VERIFIED SYSTEM',
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: "L I Z A  —  A I  ✅",
                    body: "Verified Official Bot",
                    thumbnail: imageBuffer, 
                    sourceUrl: channelLink, 
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: m }); // ഇവിടെ 'm' എന്ന് ഉപയോഗിക്കണം

    } catch (error) {
        console.error('Error in alive command:', error);
        // എറർ വന്നാൽ വെറും ടെക്സ്റ്റ് മാത്രം അയക്കും
        await sock.sendMessage(chatId, { text: "*L I Z A  —  A I* ✅\n_System is alive!_" }, { quoted: m });
    }
}

module.exports = aliveCommand;
