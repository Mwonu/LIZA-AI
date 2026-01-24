/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, m) {
    try {
        console.log("Attempting to send alive response..."); // ലോഗിൽ കാണാൻ

        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is running smoothly_\n\n` +
                         `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈  *Status:* Active\n` +
                         `◈  *Ver:* 3.0.0\n\n` +
                         `_Type .menu to see my power_`;

        const imagePath = path.join(process.cwd(), 'assets', 'bot_image.png');
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        // ലളിതമായ രീതിയിൽ കൺടെക്സ്റ്റ് സെറ്റ് ചെയ്യുന്നു
        let context = {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: "L I Z A  —  A I  ✅",
                body: "Verified Official Bot",
                sourceUrl: channelLink,
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        };

        // ഇമേജ് ഉണ്ടെങ്കിൽ മാത്രം ചേർക്കുന്നു, ഇല്ലെങ്കിൽ എറർ വരുത്തില്ല
        try {
            if (fs.existsSync(imagePath)) {
                context.externalAdReply.thumbnail = fs.readFileSync(imagePath);
            }
        } catch (e) {
            console.log("Thumbnail error:", e.message);
        }

        // മെസ്സേജ് അയക്കുന്നു
        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: context
        }, { quoted: m });

        console.log("Alive response sent successfully!");

    } catch (error) {
        console.error('Final Error in alive command:', error);
        // എറർ വന്നാലും ബോട്ട് മിണ്ടാതിരിക്കാതിരിക്കാൻ വെറും ടെക്സ്റ്റ് എങ്കിലും അയക്കും
        await sock.sendMessage(chatId, { text: "*L I Z A  —  A I* ✅\n_Bot is active but encountered a context error._" }, { quoted: m });
    }
}

module.exports = aliveCommand;
