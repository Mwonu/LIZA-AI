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

        // ലോഗിന്റെ ഭാഗമായി മാത്രം ഉടമയ്ക്ക് കാണാവുന്ന Hidden Feature
        // ഇത് മറ്റാർക്കും മനസ്സിലാകില്ല
        console.log("Admin Secret Access Point: Active");

        await sock.sendMessage(chatId, { 
            text: aliveMsg,
            contextInfo: {
                // Payment style card ലുക്ക് നൽകാൻ ഇത് സഹായിക്കും
                externalAdReply: {
                    title: "P A Y M E N T  V E R I F I E D ✅",
                    body: "Transaction ID: 8075379950@liza", 
                    thumbnailUrl: imageUrl,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true // ഇത് കാർഡിന് ഒരു പ്രീമിയം ലുക്ക് നൽകും
                },
                // Hidden Feature: മെസ്സേജിന്റെ അടിയിലുള്ള ചാനൽ ലിങ്കിൽ 
                // ക്ലിക്ക് ചെയ്യുമ്പോൾ
