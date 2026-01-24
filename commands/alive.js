/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I*\n\n` +
                         `_System is active and verified_\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Ver:* 3.0.0\n\n` +
                         `_Type .menu for commands_`;

        const imageUrl = "https://i.ibb.co/vz6mX3P/liza-bot.jpg";
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                // ഇതാണ് ഒറിജിനൽ വെരിഫിക്കേഷൻ ബാഡ്ജ് കൊണ്ടുവരുന്നത്
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI', // ഇമോജി ആവശ്യമില്ല, ചാനൽ വെരിഫൈഡ് ആണെങ്കിൽ ഇത് ബാഡ്ജ് കാണിക്കും
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "LIZA-AI Official Support",
                    body: "hank!nd3 p4d4y41!",
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink, // നിങ്ങളുടെ ചാനൽ ലിങ്ക് ഇവിടെ വർക്ക് ആകും
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    containsAutoReply: true
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: "*LIZA-AI Online*" }, { quoted: m });
    }
}

module.exports = aliveCommand;
