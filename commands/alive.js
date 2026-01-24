/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is active and verified_\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Ver:* 3.0.0\n\n` +
                         `_Type .menu for commands_`;

        const imageUrl = "https://i.ibb.co/vz6mX3P/liza-bot.jpg";
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                // വെരിഫൈഡ് ആയി തോന്നിക്കാൻ ഈ ഫ്ലാഗുകൾ സഹായിക്കും
                isForwarded: true,
                forwardingScore: 999,
                // ചാനൽ വെരിഫിക്കേഷൻ ബാഡ്ജ് കാണിക്കാൻ
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI ✅',
                    serverMessageId: 1 // -1 ന് പകരം 1 നൽകുക
                },
                externalAdReply: {
                    title: "L I Z A — A I Official ✅",
                    body: "Verified WhatsApp Support Bot",
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink, 
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false, // മുകളിലെ ആഡ്ട്രിബ്യൂഷൻ മാറ്റുന്നു
                    containsAutoReply: true // വെരിഫൈഡ് ബോട്ടുകളിൽ സാധാരണ ഉണ്ടാകാറുള്ളത്
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: "*LIZA-AI* ✅\n_System Online_" }, { quoted: m });
    }
}

module.exports = aliveCommand;
