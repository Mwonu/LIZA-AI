/**
 * - A WhatsApp Bot (LIZA-AI)
 * Copyright (c) 2024 Professor
 */
require('./settings')
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
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// --- HUGGING FACE PORT BINDING ---
const express = require('express');
const app = express();
const port = process.env.PORT || 7860;
app.get('/', (req, res) => { res.send('LIZA-AI is Running Successfully!'); });
app.listen(port, () => { console.log(chalk.green(`🌐 Server active on port ${port}`)); });

// Import lightweight store
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory monitoring
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high, restarting...');
        process.exit(1)
    }
}, 30_000)

let phoneNumber = "911234567890"
global.botname = "LIZA-AI"
global.themeemoji = "•"

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) return new Promise((resolve) => rl.question(text, resolve))
    return Promise.resolve(settings.ownerNumber || phoneNumber)
}

async function startXeonBotInc() {
    try {
        // --- SESSION ID TO CREDS.JSON CONVERSION ---
        if (!fs.existsSync('./session')) fs.mkdirSync('./session');
        
        if (!fs.existsSync('./session/creds.json') && process.env.SESSION_ID) {
            try {
                // 'Session~' ഭാഗം ഉണ്ടെങ്കിൽ അത് ഒഴിവാക്കി ബാക്കി മാത്രം എടുക്കുന്നു
                const sessionData = process.env.SESSION_ID.includes('Session~') 
                                    ? process.env.SESSION_ID.split('Session~')[1] 
                                    : process.env.SESSION_ID;
                
                const buffer = Buffer.from(sessionData, 'base64');
                fs.writeFileSync('./session/creds.json', buffer.toString());
                console.log(chalk.green('✅ Session ID converted to creds.json'));
            } catch (e) {
                console.log(chalk.red('❌ Error decoding Session ID: ' + e.message));
            }
        }

        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !process.env.SESSION_ID, // Session ID ഇല്ലെങ്കിൽ മാത്രം QR കാണിക്കുക
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        XeonBotInc.ev.on('creds.update', saveCreds)
        store.bind(XeonBotInc.ev)

        // Connection update
        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s
            if (connection === 'connecting') console.log(chalk.yellow('🔄 Connecting...'))
            if (connection == "open") {
                console.log(chalk.green(`🤖 Connected Successfully!`))
                const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                await XeonBotInc.sendMessage(botNumber, { text: `🤖 *LIZA-AI Connected!* \n\nSession ID mode enabled ✅` });
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldReconnect) startXeonBotInc()
            }
        })

        // Message Handling
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

        XeonBotInc.public = true
        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

        // Pairing Code Handler (If no Session ID)
        if (!XeonBotInc.authState.creds.registered && !process.env.SESSION_ID) {
            let phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Type your number (e.g. 918075xxxxxx): `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            setTimeout(async () => {
                try {
                    let code = await XeonBotInc.requestPairingCode(phoneNumber)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code: ${code}`)))
                } catch (error) {
                    console.error('Pairing Error:', error)
                }
            }, 3000)
        }

        return XeonBotInc
    } catch (error) {
        console.error('Fatal Error:', error)
        await delay(5000)
        startXeonBotInc()
    }
}

startXeonBotInc()
