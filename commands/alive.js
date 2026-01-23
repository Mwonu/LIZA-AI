/// Copyright @(hank!nd3 p4d4y41!
const settings = require('../config');

async function aliveCommand(sock, chatId, message) {
    const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                     `_System is running smoothly_\n\n` +
                     `◈  *Owner:* (hank!nd3 p4d4y41!)\n` +
                     `◈  *Status:* Active\n` +
                     `◈  *Ver:* 3.0.0\n\n` +
                     `_Type .menu to see my power_`;

    await sock.sendMessage(chatId, { 
        text: aliveMsg,
        contextInfo: {
            externalAdReply: {
                title: "L I Z A  V E R I F I E D  S Y S T EＭ ✅",
                body: "(hank!nd3 p4d4y41!)",
                thumbnailUrl: "https://your-image-url.jpg", // നിങ്ങളുടെ ഫോട്ടോ ലിങ്ക്
                sourceUrl: "", // ഇവിടെ ചാനൽ ലിങ്ക് ഒഴിവാക്കി വെറും കാലിയാക്കി ഇടാം
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: message });
}

module.exports = aliveCommand;
