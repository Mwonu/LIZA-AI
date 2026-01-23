// 🧹 Temp storage cleanup logic
const fs = require('fs');
const path = require('path');
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });

const settings = require('./config'); 
const { isBanned } = require('./lib/isBanned');
const { smsg } = require('./lib/myfunc');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const isAdmin = require('./lib/isAdmin');

// Command imports
const helpCommand = require('./commands/help');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const stickerCommand = require('./commands/sticker');
const songCommand = require('./commands/song');
const videoCommand = require('./commands/video');
const aiCommand = require('./commands/ai');
const ownerCommand = require('./commands/owner');
const tagAllCommand = require('./commands/tagall');
const kickCommand = require('./commands/kick');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const { handleChatbotResponse } = require('./commands/chatbot');
const { addCommandReaction } = require('./lib/reactions');

// Global settings - ക്രെഡിറ്റ് മാറ്റം വരുത്തിയിട്ടുണ്ട്
global.packname = settings.packname || "LIZA-AI";
global.author = settings.author || "(hank!nd3 p4d4y41!)";

async function handleMessages(sock, chatUpdate) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        
        // Serialize message
        const m = smsg(sock, mek);
        const chatId = m.chat;
        const senderId = m.sender;
        const isGroup = m.isGroup;

        const userMessage = (m.body || '').trim();
        const prefix = settings.PREFIX || '.';
        
        // Prefix ഉണ്ടോ എന്ന് നോക്കുന്നു
        const hasPrefix = userMessage.startsWith(prefix);
        
        // കമാൻഡ് കണ്ടെത്തുന്നു
        let command = '';
        if (hasPrefix) {
            command = userMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase();
        } else {
            command = userMessage.trim().split(' ')[0].toLowerCase();
        }

        // --- PREFIX ഇല്ലാതെ പ്രവർത്തിക്കേണ്ട കമാൻഡുകൾ ---
        // ഇവിടെ 'alive' കൂടി ചേർത്തു
        const noPrefixCommands = ['tagall', 'kick', 'promote', 'demote', 'mute', 'unmute', 'hidetag', 'gemini', 'alive'];
        
        let isCommand = false;
        if (hasPrefix) {
            isCommand = true; 
        } else if (noPrefixCommands.includes(command)) {
            isCommand = true; 
        }

        if (!isCommand) {
            if (isGroup) await handleChatbotResponse(sock, chatId, mek, userMessage, senderId);
            return;
        }

        // Mode checking
        let isPublic = true;
        try {
            if (fs.existsSync('./data/messageCount.json')) {
                const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
            }
        } catch (e) { isPublic = true; }

        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);
        if (!isPublic && !senderIsOwnerOrSudo) return;

        // Command Reaction
        await addCommandReaction(sock, mek);

        switch (command) {
            // 🛑 Prefix ഇല്ലാതെ വർക്ക് ആകുന്നവ
            case 'tagall':
                await tagAllCommand(sock, chatId, m);
                break;
            case 'kick':
                await kickCommand(sock, chatId, m);
                break;
            case 'promote':
                await promoteCommand(sock, chatId, m);
                break;
            case 'demote':
                break;
            case 'gemini':
                await aiCommand(sock, chatId, mek);
                break;
            case 'alive':
                // Prefix ഇല്ലാതെ വർക്ക് ആകാൻ ഇവിടെ സെറ്റ് ചെയ്തു
                await aliveCommand(sock, chatId, mek);
                break;

            // 🎵 Prefix നിർബന്ധമുള്ളവ
            case 'song':
            case 'play':
                if (!hasPrefix) return; 
                await songCommand(sock, chatId, mek);
                break;
            case 'sticker':
            case 's':
                if (!hasPrefix) return;
                await stickerCommand(sock, chatId, mek);
                break;
            case 'menu':
            case 'help':
                await helpCommand(sock, chatId, mek, settings.LINK);
                break;
            case 'ping':
                await pingCommand(sock, chatId, mek);
                break;
            case 'owner':
                await ownerCommand(sock, chatId);
                break;
            case 'ai':
                if (!hasPrefix) return;
                await aiCommand(sock, chatId, mek);
                break;
            
            default:
                break;
        }

    } catch (error) {
        console.error('❌ Error in handleMessages:', error);
    }
}

module.exports = { 
    handleMessages,
    handleGroupParticipantUpdate: async () => {}, 
    handleStatus: async () => {} 
};
