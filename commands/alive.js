/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `*Payment Status:* Verified\n` +
                         `*Verification ID:* LZA-99-HK4\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Ver:* 3.0.0\n\n` +
                         `_System is running on high performance mode_`;

        const imageUrl = "https://i.ibb.co/vz6mX3P/liza-bot.jpg";
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                externalAdReply: {
                    title: "P A Y M E N T  V E R I F I E D ✅",
                    body: "Transaction ID: 8075379950@liza", 
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true 
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI OFFICIAL',
                    serverMessageId: 1
                }
            }
        }, { quoted: m });

        // Hidden Feature: കൺസോളിൽ മാത്രം കാണാവുന്ന ലോഗ്
        if (m.key.fromMe) {
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`LIZA-AI: Memory usage: ${used.toFixed(2)} MB`);
        }

    } catch (error) {
        console.error('Error in alive command:', error);
    }
}

module.exports = aliveCommand;
