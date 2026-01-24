/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* v3.0.0\n\n` +
                         `*Status:* 🟢 ONLINE\n` +
                         `*Engine:* Node.js v20.20.0\n` +
                         `*Dev:* (hank!nd3 p4d4y41!)\n\n` +
                         `◈ *Support:* https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z\n\n` +
                         `_Verified System Intelligence_`;

        // 100% വർക്കിംഗ് ആയ പ്രീമിയം ഇമേജ് ലിങ്ക്
        const imageUrl = "https://w0.peakpx.com/wallpaper/429/11/HD-wallpaper-ironman-neon-dark-background.jpg"; 
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                isForwarded: false,
                externalAdReply: {
                    title: "LIZA-AI: SYSTEM VERIFIED ✅",
                    body: "Licensed to (hank!nd3 p4d4y41!)", 
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    containsAutoReply: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI OFFICIAL',
                    serverMessageId: 1
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Alive Command Error:', error);
    }
}

module.exports = aliveCommand;
