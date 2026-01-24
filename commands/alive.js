/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I* ` + "```3.0.0```" + `\n\n` +
                         `*System Status:* ` + "```ONLINE```" + `\n` +
                         `*Security:* ` + "```ENCRYPTED```" + `\n` +
                         `*Provider:* (hank!nd3 p4d4y41!)\n\n` +
                         `◈ *Support:* https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z\n\n` +
                         `_Powered by High-Performance Node.js Engine_`;

        // വാട്സാപ്പ് ബ്ലോക്ക് ചെയ്യാത്ത പുതിയ പ്രീമിയം ഇമേജ് ലിങ്ക്
        const imageUrl = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop"; 
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                // പ്രീമിയം ലുക്കിനായി Forwarded ടാഗ് പൂർണ്ണമായും ഒഴിവാക്കുന്നു
                isForwarded: false,
                externalAdReply: {
                    title: "L I Z A  S Y S T E M  V E R I F I E D ✅",
                    body: "hank!nd3 p4d4y41! | Official Developer", 
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    containsAutoReply: true
                },
                // ഒറിജിനൽ വെരിഫൈഡ് ചാനൽ ബാഡ്ജ് വരാൻ
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
