/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        const aliveMsg = `*L I Z A  —  A I*\n\n` +
                         `*Payment Status:* Verified\n` +
                         `*Verification ID:* LZA-99-HK4\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Ver:* 3.0.0\n\n` +
                         `_System is running on high performance mode_`;

        // ഇമേജ് ലോഡ് ആകാൻ ഈ പുതിയ ലിങ്ക് ഉപയോഗിക്കുക
        const imageUrl = "https://telegra.ph/file/188b030386766e40b372f.jpg"; 
        const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                // ഫോർവേഡ് മാർക്ക് ഒഴിവാക്കി ഒറിജിനൽ ലുക്ക് നൽകാൻ
                isForwarded: false, 
                forwardingScore: 0,
                externalAdReply: {
                    title: "P A Y M E N T  V E R I F I E D ✅",
                    body: "hank!nd3 p4d4y41!", 
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false // ആ ചെറിയ 'Forwarded' ടാഗ് കളയാൻ ഇത് സഹായിക്കും
                },
                // ചാനൽ വെരിഫിക്കേഷൻ താഴെ വരാൻ
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'LIZA-AI OFFICIAL ✅', // ഇവിടെ ഗ്രീൻ ടിക്ക് നിർബന്ധമായും ചേർക്കുക
                    serverMessageId: 1
                }
            }
        }, { quoted: m });

        // Hidden memory log for owner
        if (m.key.fromMe) {
            console.log(`LIZA-AI Stats: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB RAM used.`);
        }

    } catch (error) {
        console.error('Alive Command Error:', error);
    }
}

module.exports = aliveCommand;
