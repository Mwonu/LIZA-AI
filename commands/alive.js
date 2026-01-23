/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, message) {
    const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                     `_System is running smoothly_\n\n` +
                     `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                     `◈  *Status:* Active\n` +
                     `◈  *Ver:* 3.0.0\n\n` +
                     `_Type .menu to see my power_`;

    // 🖼️ PNG ഫോട്ടോ പാത്ത് എടുക്കുന്നു
    const imagePath = path.join(__dirname, '../assets/bot_image.png');
    const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

    await sock.sendMessage(chatId, { 
        text: aliveMsg,
        contextInfo: {
            // 🛡️ ഈ ഭാഗമാണ് ഒറിജിനൽ വെരിഫിക്കേഷൻ ലുക്ക് നൽകുന്നത്
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
                thumbnail: fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null,
                sourceUrl: channelLink, // നിങ്ങളുടെ ചാനൽ ലിങ്ക്
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        }
    }, { quoted: message });
}

module.exports = aliveCommand;
