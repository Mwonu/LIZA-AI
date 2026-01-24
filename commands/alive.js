/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, m) {
    try {
        console.log("--- Executing Alive Command ---");

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

        // ഇമേജ് ഉണ്ടെങ്കിൽ മാത്രം ചേർക്കുന്നു
        try {
            if (fs.existsSync(imagePath)) {
                context.externalAdReply.thumbnail = fs.readFileSync(imagePath);
            }
        } catch (e) {
            console.log("Asset Error: Image not found at " + imagePath);
        }

        // മെസ്സേജ് അയക്കുന്നു
        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: context
        }, { quoted: m });

        console.log("✅ Alive message sent to:", chatId);

    } catch (error) {
        console.error('CRITICAL ERROR in alive.js:', error);
        // എറർ വന്നാൽ സിമ്പിൾ ടെക്സ്റ്റ് അയക്കും
        try {
            await sock.sendMessage(chatId, { text: "*L I Z A  —  A I* ✅\n_System is alive!_" }, { quoted: m });
        } catch (retryErr) {
            console.log("Failed to send even simple text.");
        }
    }
}

module.exports = aliveCommand;
