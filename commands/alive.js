/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is running smoothly_\n\n` +
                         `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈  *Status:* Active\n` +
                         `◈  *Ver:* 3.0.0\n\n` +
                         `_Type .menu to see my power_`;

        const imagePath = path.join(process.cwd(), 'assets', 'bot_image.png');
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

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

        // ഇമേജ് ഉണ്ടെങ്കിൽ മാത്രം തംബ്നെയിൽ ചേർക്കുന്നു
        if (fs.existsSync(imagePath)) {
            context.externalAdReply.thumbnail = fs.readFileSync(imagePath);
        }

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: context
        }, { quoted: m });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: "*L I Z A  —  A I* ✅\n_System is alive!_" }, { quoted: m });
    }
}

module.exports = aliveCommand;
