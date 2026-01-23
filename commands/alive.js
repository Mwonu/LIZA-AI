/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, message) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is running smoothly_\n\n` +
                         `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈  *Status:* Active\n` +
                         `◈  *Ver:* 3.0.0\n\n` +
                         `_Type .menu to see my power_`;

        // 🖼️ കൂടുതൽ സ്റ്റേബിൾ ആയ രീതിയിൽ പാത്ത് സെറ്റ് ചെയ്യുന്നു
        const imagePath = path.join(process.cwd(), 'assets', 'bot_image.png');
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        // ഫോട്ടോ ഉണ്ടോ എന്ന് ചെക്ക് ചെയ്യുന്നു
        let imageBuffer;
        if (fs.existsSync(imagePath)) {
            imageBuffer = fs.readFileSync(imagePath);
        } else {
            console.log("Alive Image not found at:", imagePath);
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
                    thumbnail: imageBuffer || null, // ഫോട്ടോ ഉണ്ടെങ്കിൽ മാത്രം നൽകുന്നു
                    sourceUrl: channelLink, 
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        // എറർ വന്നാലും ടെക്സ്റ്റ് മെസ്സേജ് അയക്കാൻ ശ്രമിക്കും
        await sock.sendMessage(chatId, { text: "_System is alive! (Error loading thumbnail)_" }, { quoted: message });
    }
}

module.exports = aliveCommand;
