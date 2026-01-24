// 🧹 Temp storage cleanup logic
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });

const settings = require('./config'); 
const { smsg } = require('./lib/myfunc');
const isOwnerOrSudo = require('./lib/isOwner');

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
const { handleChatbotResponse = () => {} } = require('./commands/chatbot');
const { addCommandReaction } = require('./lib/reactions');

// Global settings - ക്രെഡിറ്റ് (hank!nd3 p4d4y41!)
global.packname = settings.packname || "LIZA-AI";
global.author = settings.author || "(hank!nd3 p4d4y41!)";

async function handleMessages(sock, chatUpdate) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return;

        const m = smsg(sock, mek);
        const chatId = m.chat;
        const senderId = m.sender;
        const isGroup = m.isGroup;

        // 🛠️ മെസ്സേജ് ഡിറ്റക്ഷൻ മെച്ചപ്പെടുത്തി
        const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype === 'imageMessage') ? m.message.imageMessage.caption : (m.mtype === 'videoMessage') ? m.message.videoMessage.caption : (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : m.text || '';
        
        const userMessage = body.trim();
        const prefix = settings.PREFIX || '.';
        const prefixMode = settings.PREFIX_MODE || 'hybrid';
        
        const hasPrefix = userMessage.startsWith(prefix);
        let command = '';
        let isCommand = false;

        // --- ഡിനാമിക് പ്രിഫിക്സ് ലോജിക് ---
        if (prefixMode === 'prefix') {
            if (hasPrefix) {
                command = userMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase();
                isCommand = true;
            }
        } else if (prefixMode === 'no-prefix') {
            command = userMessage.trim().split(' ')[0].toLowerCase();
            isCommand = true;
        } else if (prefixMode === 'hybrid') {
            if (hasPrefix) {
                command = userMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase();
                isCommand = true;
            } else {
                const tempCmd = userMessage.trim().split(' ')[0].toLowerCase();
                const noPrefixList = ['menu', 'help', 'alive', 'ai', 'ping', 'gemini'];
                if (noPrefixList.includes(tempCmd)) {
                    command = tempCmd;
                    isCommand = true;
                }
            }
        }

        if (!isCommand || command === '') {
            if (isGroup) await handleChatbotResponse(sock, chatId, mek, userMessage, senderId);
            return;
        }

        // 📝 റെയിൽവേ ലോഗ്
        console.log(chalk.black(chalk.bgGreen('[ EXECUTE ]')), chalk.green(command), 'from', chalk.yellow(senderId.split('@')[0]));

        // Reaction ആഡ് ചെയ്യുന്നു
        try { await addCommandReaction(sock, mek); } catch (e) {}

        // --- കമാൻഡ് സ്വിച്ച് ലോജിക് (Error Protected) ---
        // കമാൻഡുകൾ ഫങ്ക്ഷൻ ആണോ എന്ന് പരിശോധിച്ച ശേഷം മാത്രം വിളിക്കുന്നു
        const executeCmd = async (cmdFunc, ...args) => {
            try {
                if (typeof cmdFunc === 'function') {
                    await cmdFunc(...args);
                } else if (cmdFunc && typeof cmdFunc.default === 'function') {
                    await cmdFunc.default(...args);
                } else {
                    console.log(chalk.red(`Command function not found for: ${command}`));
                }
            } catch (err) {
                console.error(chalk.red(`Error executing ${command}:`), err);
            }
        };

        switch (command) {
            case 'menu':
            case 'help':
                await executeCmd(helpCommand, sock, chatId, m);
                break;
            case 'alive':
                await executeCmd(aliveCommand, sock, chatId, m);
                break;
            case 'ping':
                await executeCmd(pingCommand, sock, chatId, m);
                break;
            case 'gemini':
            case 'ai':
                await executeCmd(aiCommand, sock, chatId, m);
                break;
            case 'sticker':
            case 's':
                await executeCmd(stickerCommand, sock, chatId, m);
                break;
            case 'song':
            case 'play':
                await executeCmd(songCommand, sock, chatId, m);
                break;
            case 'video':
                await executeCmd(videoCommand, sock, chatId, m);
                break;
            case 'tagall':
                await executeCmd(tagAllCommand, sock, chatId, m);
                break;
            case 'kick':
                await executeCmd(kickCommand, sock, chatId, m);
                break;
            case 'promote':
                await executeCmd(promoteCommand, sock, chatId, m);
                break;
            case 'demote':
                await executeCmd(demoteCommand, sock, chatId, m);
                break;
            case 'owner':
                await executeCmd(ownerCommand, sock, chatId);
                break;
            default:
                if (isGroup) await handleChatbotResponse(sock, chatId, mek, userMessage, senderId);
                break;
        }

    } catch (error) {
        console.error(chalk.red('❌ Error in handleMessages:'), error);
    }
}

module.exports = { 
    handleMessages,
    handleGroupParticipantUpdate: async () => {}, 
    handleStatus: async () => {} 
};
