/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    try {
        const userMessage = (message.message?.conversation || message.message?.extendedTextMessage?.text || '').trim();
        const args = userMessage.split(' ');
        
        // --- ഹെഡർ ഡിസൈൻ ---
        const header = `L I Z A  —  A I  ✅\n_v 3.0.0_  •  (hank!nd3 p4d4y41!)\n\n`;

        // 1. മെയിൻ ഇൻഡക്സ് (വെറുതെ menu എന്ന് ടൈപ്പ് ചെയ്യുമ്പോൾ)
        if (args.length === 1) {
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

        // 2. സബ് സെക്ഷനുകൾ
        if (choice === '01' || choice === '1') {
            subMenu += `G E N E R A L\n\n• ping\n• alive\n• owner\n• joke\n• quote\n• weather\n• news\n• lyrics\n• groupinfo\n• staff\n• trt`;
        } else if (choice === '02' || choice === '2') {
            subMenu += `G R O U P\n\n• ban\n• promote\n• demote\n• mute\n• unmute\n• kick\n• warn\n• antilink\n• chatbot\n• tagall\n• hidetag\n• welcome`;
        } else if (choice === '03' || choice === '3') {
            subMenu += `A I  T O O L S\n\n• gemini (Direct)\n• gpt\n• imagine\n• flux\n• sora`;
        } else if (choice === '04' || choice === '4') {
            subMenu += `D O W N L O A D S\n\n• play\n• song\n• spotify\n• instagram\n• facebook\n• tiktok\n• video`;
        } else if (choice === '05' || choice === '5') {
            subMenu += `I M A G E S\n\n• sticker\n• blur\n• simage\n• removebg\n• remini\n• meme\n• emojimix`;
        } else if (choice === '06' || choice === '6') {
            subMenu += `F U N  &  G A M E S\n\n• tictactoe\n• truth\n• dare\n• flirting\n• shayari\n• ship\n• wasted\n• anime`;
        } else if (choice === '07' || choice === '7') {
            subMenu += `T E X T  M A K E R\n\n• neon\n• matrix\n• glitch\n• ice\n• fire\n• hacker\n• sand\n• purple`;
        } else if (choice === '08' || choice === '8') {
            subMenu += `O W N E R\n\n• mode\n• update\n• clearsession\n• antidelete\n• setpp\n• pmblocker`;
        } else {
            return await sock.sendMessage(chatId, { text: "_Section not found!_" }, { quoted: message });
        }

        return await sendMenu(sock, chatId, subMenu, message);

    } catch (error) {
        console.error('Menu Error:', error);
    }
}

async function sendMenu(sock, chatId, text, quoted) {
    // 🖼️ PNG പാത്ത് സെറ്റ് ചെയ്യുന്നു
    const imagePath = path.join(__dirname, '../assets/bot_image.png');
    const channelLink = "https://whatsapp.com/channel/0029VbC31l07NoZrfZOPZu1z";

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
            thumbnail: fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null,
            sourceUrl: channelLink, // നിങ്ങളുടെ ചാനൽ ലിങ്ക്
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
        }
    };

    // ഫോട്ടോ ഉണ്ടെങ്കിൽ അത് അയക്കും
    if (fs.existsSync(imagePath)) {
        return await sock.sendMessage(chatId, { 
            image: fs.readFileSync(imagePath), 
            caption: text, 
            contextInfo 
        }, { quoted });
    } else {
        return await sock.sendMessage(chatId, { text, contextInfo }, { quoted });
    }
}

module.exports = helpCommand;
