/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is active and verified_\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Ver:* 3.0.0\n\n` +
                         `_Type .menu for commands_`;

        // ഇമേജ് ലിങ്ക് നേരിട്ട് നൽകുന്നതാണ് കൂടുതൽ സുരക്ഷിതം
        const imageUrl = "https://i.ibb.co/vz6mX3P/liza-bot.jpg"; // നിങ്ങളുടെ ഇമേജ് ലിങ്ക് ഇവിടെ നൽകാം
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                // വെരിഫിക്കേഷൻ ബാഡ്ജ് വരാൻ ഇത് സഹായിക്കും
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI ✅',
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: "L I Z A  —  A I  ✅",
                    body: "Verified Official Bot",
                    thumbnailUrl: imageUrl, // ഫയലിന് പകരം URL ഉപയോഗിക്കുന്നു
                    sourceUrl: channelLink, 
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Error in alive command:', error);
        // എന്തെങ്കിലും എറർ വന്നാൽ വെറും ടെക്സ്റ്റ് എങ്കിലും അയക്കും
        await sock.sendMessage(chatId, { text: "*L I Z A  —  A I* ✅\n_System is active!_" }, { quoted: m });
    }
}

module.exports = aliveCommand;
