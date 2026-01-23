/**
 * - A WhatsApp Bot (LIZA-AI)
 * Optimized for Railway Deployment
 */
require('./config') // settings എന്നതിന് പകരം config എന്ന് മാറ്റി
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")

// --- RAILWAY PORT BINDING ---
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 

app.get('/', (req, res) => { res.send('LIZA-AI is Running Successfully!'); });
app.listen(port, "0.0.0.0", () => { 
    console.log(chalk.green(`🌐 Server active on port ${port}`)); 
});

// Import lightweight store
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./config') // settings എന്നതിന് പകരം config എന്ന് മാറ്റി
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory management optimized
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 450) { 
        console.log('⚠️ RAM limit reached, restarting...');
        process.exit(1)
    }
}, 60_000)

async function startXeonBotInc() {
    try {
        if (!fs.existsSync('./session')) fs.mkdirSync('./session');
        
        if (!fs.existsSync('./session/creds.json') && process.env.SESSION_ID) {
            try {
                const sessionData = process.env.SESSION_ID.includes('Session~') 
                                    ? process.env.SESSION_ID.split('Session~')[1] 
                                    : process.env.SESSION_ID;
                
                const buffer = Buffer.from(sessionData, 'base64');
                fs.writeFileSync('./session/creds.json', buffer.toString());
                console.log(chalk.green('✅ Session ID successfully loaded!'));
            } catch (e) {
                console.log(chalk.red('❌ Session ID conversion failed: ' + e.message));
            }
        }

        let { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !process.env.SESSION_ID,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            syncFullHistory: false,
            msgRetryCounterCache,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000,
        })

        XeonBotInc.ev.on('creds.update', saveCreds)
        store.bind(XeonBotInc.ev)

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s
            if (connection === 'connecting') console.log(chalk.yellow('🔄 LIZA-AI is connecting...'))
            if (connection == "open") {
                console.log(chalk.green(`🤖 Connected Successfully to WhatsApp!`))
                const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                await XeonBotInc.sendMessage(botNumber, { text: `🤖 *LIZA-AI is Live!* \n\nYour bot is now running on Railway.` });
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldReconnect) {
                    console.log(chalk.red('❌ Connection lost. Reconnecting...'))
                    startXeonBotInc()
                }
            }
        })

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(XeonBotInc, chatUpdate);
                    return;
                }
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) {
                console.error(err)
            }
        })

        // റെയിൽവേയിലെ MODE അനുസരിച്ച് പബ്ലിക്/പ്രൈവറ്റ് സെറ്റ് ചെയ്യുന്നു
        XeonBotInc.public = settings.MODE === 'public' ? true : false
        
        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

        return XeonBotInc
    } catch (error) {
        console.error('Fatal Error:', error)
        await delay(5000)
        startXeonBotInc()
    }
}

startXeonBotInc()
