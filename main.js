// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

// പ്രധാനപ്പെട്ട മാറ്റം: config ഫയലിനെ settings എന്ന പേരിൽ തന്നെ വിളിക്കുന്നു
const settings = require('./config'); 
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');

// Global settings
global.packname = settings.packname || "KnightBot";
global.author = settings.author || "Unique Hacker";
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "Mr Unique Hacker";

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363161513685998@newsletter',
            newsletterName: 'KnightBot MD',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Auto read and Antidelete functions
        await handleAutoread(sock, message);
        if (message.message) storeMessage(sock, message);

        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        
        // Sudo and Owner check
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;

        const userMessage = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            ''
        ).trim();

        const prefix = settings.PREFIX || '.';
        const isCommand = userMessage.startsWith(prefix);
        const command = isCommand ? userMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = userMessage.trim().split(' ').slice(1);
        const rawText = userMessage;

        // Log Command Usage
        if (isCommand) {
            console.log(`📝 Command: ${command} | From: ${senderId} | Group: ${isGroup}`);
        }

        // Mode checking (Public/Private)
        let isPublic = true;
        try {
            if (fs.existsSync('./data/messageCount.json')) {
                const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
            }
        } catch (e) { isPublic = true; }

        if (!isPublic && !isOwnerOrSudoCheck) return;

        // Ban Check
        if (isBanned(senderId) && command !== 'unban') return;

        // Admin checks for group commands
        let isBotAdmin = false;
        let isSenderAdmin = false;
        if (isGroup) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isBotAdmin = adminStatus.isBotAdmin;
            isSenderAdmin = adminStatus.isSenderAdmin;
            
            // Antilink and Moderation
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            await Antilink(message, sock);
            await handleTagDetection(sock, chatId, message, senderId);
        }

        // Command Switch
        if (isCommand) {
            // Reaction for command
            await addCommandReaction(sock, message);

            switch (command) {
                case 'menu':
                case 'help':
                case 'list':
                    await helpCommand(sock, chatId, message, global.channelLink);
                    break;
                case 'ping':
                    await pingCommand(sock, chatId, message);
                    break;
                case 'alive':
                    await aliveCommand(sock, chatId, message);
                    break;
                case 'sticker':
                case 's':
                    await stickerCommand(sock, chatId, message);
                    break;
                case 'owner':
                    await ownerCommand(sock, chatId);
                    break;
                case 'song':
                case 'play':
                    await songCommand(sock, chatId, message);
                    break;
                case 'video':
                    await videoCommand(sock, chatId, message);
                    break;
                case 'ai':
                case 'gpt':
                    await aiCommand(sock, chatId, message);
                    break;
                case 'mode':
                    if (!isOwnerOrSudoCheck) return sock.sendMessage(chatId, { text: "Owner only!" });
                    const newMode = args[0]?.toLowerCase();
                    if (newMode === 'public' || newMode === 'private') {
                        const modeData = { isPublic: newMode === 'public' };
                        fs.writeFileSync('./data/messageCount.json', JSON.stringify(modeData));
                        sock.sendMessage(chatId, { text: `Bot mode changed to ${newMode}` });
                    } else {
                        sock.sendMessage(chatId, { text: "Usage: .mode public/private" });
                    }
                    break;
                // മറ്റ് കമാൻഡുകൾ താഴെ വരും...
                default:
                    // തനിയെ ഉള്ള ചാറ്റ്ബോട്ട് പ്രതികരണം
                    if (isGroup && isPublic) {
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    break;
            }
        } else {
            // Not a command - Handle auto-typing or chatbot
            if (isGroup) {
                await handleMentionDetection(sock, chatId, message);
                if (isPublic) await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    const { id, participants, action } = update;
    if (action === 'add') await handleJoinEvent(sock, id, participants);
    if (action === 'remove') await handleLeaveEvent(sock, id, participants);
    if (action === 'promote') await handlePromotionEvent(sock, id, participants);
    if (action === 'demote') await handleDemotionEvent(sock, id, participants);
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};
