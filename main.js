async function handleMessages(sock, messageUpdate) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        await handleAutoread(sock, message);
        if (message.message) storeMessage(sock, message);

        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        
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
        
        // 1. Prefix ഉണ്ടോ എന്ന് നോക്കുന്നു
        const hasPrefix = userMessage.startsWith(prefix);
        
        // 2. Prefix മാറ്റിയ ശേഷം കമാൻഡ് കണ്ടെത്തുന്നു
        let command = '';
        if (hasPrefix) {
            command = userMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase();
        } else {
            command = userMessage.trim().split(' ')[0].toLowerCase();
        }

        const args = userMessage.trim().split(' ').slice(1);

        // --- PREFIX ഇല്ലാതെ പ്രവർത്തിക്കേണ്ട കമാൻഡുകൾ ---
        const noPrefixCommands = ['tagall', 'kick', 'promote', 'demote', 'mute', 'unmute', 'hidetag', 'tagnotadmin'];
        
        // കമാൻഡ് ആണോ എന്ന് തീരുമാനിക്കുന്നു
        let isCommand = false;
        if (hasPrefix) {
            isCommand = true; // Prefix ഉണ്ടെങ്കിൽ എല്ലാം കമാൻഡ് ആണ്
        } else if (noPrefixCommands.includes(command)) {
            isCommand = true; // Prefix ഇല്ലെങ്കിലും ലിസ്റ്റിൽ ഉണ്ടെങ്കിൽ കമാൻഡ് ആണ്
        }

        if (!isCommand) {
            if (isGroup) {
                await handleMentionDetection(sock, chatId, message);
                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
            }
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

        if (!isPublic && !isOwnerOrSudoCheck) return;
        if (isBanned(senderId) && command !== 'unban') return;

        let isBotAdmin = false;
        let isSenderAdmin = false;
        if (isGroup) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isBotAdmin = adminStatus.isBotAdmin;
            isSenderAdmin = adminStatus.isSenderAdmin;
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            await Antilink(message, sock);
            await handleTagDetection(sock, chatId, message, senderId);
        }

        // --- COMMAND EXECUTION ---
        await addCommandReaction(sock, message);

        switch (command) {
            // 🛑 Prefix ഇല്ലാതെയും കൂടെ വർക്ക് ആകുന്ന ഗ്രൂപ്പ് കമാൻഡുകൾ
            case 'tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case 'kick':
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case 'promote':
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case 'demote':
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;

            // 🎵 Prefix നിർബന്ധമുള്ള സാധാരണ കമാൻഡുകൾ
            case 'song':
            case 'play':
                if (!hasPrefix) return; // Prefix ഇല്ലെങ്കിൽ പാട്ട് വർക്ക് ആകില്ല
                await songCommand(sock, chatId, message);
                break;
            case 'sticker':
            case 's':
                if (!hasPrefix) return; // Prefix ഇല്ലെങ്കിൽ സ്റ്റിക്കർ വർക്ക് ആകില്ല
                await stickerCommand(sock, chatId, message);
                break;
            case 'menu':
            case 'help':
                await helpCommand(sock, chatId, message, global.channelLink);
                break;
            case 'ping':
                await pingCommand(sock, chatId, message);
                break;
            case 'ai':
            case 'gpt':
                if (!hasPrefix) return;
                await aiCommand(sock, chatId, message);
                break;
            case 'owner':
                await ownerCommand(sock, chatId);
                break;
            
            default:
                break;
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}
