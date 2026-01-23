/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    try {
        const userMessage = (message.body || '').trim();
        const args = userMessage.split(' ');
        
        const header = `L I Z A  —  A I  ✅\n_v 3.0.0_  •  (hank!nd3 p4d4y41!)\n\n`;

        if (args.length === 1 || args[1] === '') {
            const indexMenu = header + 
                `S E L E C T  S E C T I O N\n\n` +
                `01   General & System\n` +
                `02   Group Management\n` +
                `03   Artificial Intelligence\n` +
                `04   Media & Downloads\n` +
                `05   Image & Stickers\n` +
                `06   Entertainment & Fun\n` +
                `07   Text Makers\n` +
                `08   Owner Settings\n\n` +
                `_Reply with *menu [number]* to open_`;

            return await sendMenu(sock, chatId, indexMenu, message);
        }

        const choice = args[1];
        let subMenu = header;

        if (choice === '01' || choice === '1') {
            subMenu += `G E N E R A L\n\n• ping\n• alive\n• owner\n• joke\n• quote\n• weather\n• news\n• lyrics\n• groupinfo\n• staff\n• trt`;
        } else if (choice === '02' || choice === '2') {
            subMenu += `G R O U P\n\n• ban\n• promote\n• demote\n• mute\n• unmute\n• kick\n• warn\n• antilink\n• chatbot\n• tagall\n• hidetag\n• welcome`;
        } // ... മറ്റ് സെക്ഷനുകൾ മാറ്റമില്ലാതെ തുടരും

        return await sendMenu(sock, chatId, subMenu, message);

    } catch (error) {
        console.error('Menu Error:', error);
    }
}

async function sendMenu(sock, chatId, text, quoted) {
    // 🖼️ പാത്ത് കൃത്യമാണെന്ന് ഉറപ്പാക്കാൻ process.cwd() ഉപയോഗിക്കുന്നു
    const imagePath = path.join(process.cwd(), 'assets', 'bot_image.png');
    const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

    let imageBuffer;
    try {
        if (fs.existsSync(imagePath)) {
            imageBuffer = fs.readFileSync(imagePath);
        }
    } catch (e) {
        console.log("Image load error:", e);
    }

    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363161513685998@newsletter',
            newsletterName: 'LIZA-AI ✅ (hank!nd3 p4d4y41!)',
            serverMessageId: -1
        },
        externalAdReply: {
            title: "L I Z A  —  A I  ✅",
            body: "Verified Official Menu",
            thumbnail: imageBuffer,
            sourceUrl: channelLink,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
        }
    };

    if (imageBuffer) {
        return await sock.sendMessage(chatId, { 
            image: imageBuffer, 
            caption: text, 
            contextInfo 
        }, { quoted });
    } else {
        return await sock.sendMessage(chatId, { text, contextInfo }, { quoted });
    }
}

module.exports = helpCommand;
