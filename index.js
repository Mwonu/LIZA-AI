/**
 * - A WhatsApp Bot (LIZA-AI)
 * Optimized for Railway Deployment
 * Updated by: (hank!nd3 p4d4y41!)
 */
require('./config') 
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { smsg } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")

// --- RAILWAY PORT BINDING ---
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 

app.get('/', (req, res) => { res.send('LIZA-AI is Running Successfully!'); });
app.listen(port, "0.0.0.0", () => { 
    console.log(chalk.green(`🌐 Server active on port ${port}`)); 
});

const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./config') 
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

async function startXeonBotInc() {
    try {
        if (!fs.existsSync('./session')) fs.mkdirSync('./session');
        
        // --- SESSION ID HANDLING START (hank!nd3 p4d4y41!) ---
        if (!fs.existsSync('./session/creds.json') && process.env.SESSION_ID) {
            try {
                let sessionID = process.env.SESSION_ID;
                let sessionData;

                // LIZA~ അല്ലെങ്കിൽ Session~ പ്രിഫിക്സുകൾ ഉണ്ടെങ്കിൽ അവ ഒഴിവാക്കുന്നു
                if (sessionID.includes('LIZA~')) {
                    sessionData = sessionID.split('LIZA~')[1];
                } else if (sessionID.includes('Session~')) {
                    sessionData = sessionID.split('Session~')[1];
                } else {
                    sessionData = sessionID;
                }
                
                const buffer = Buffer.from(sessionData, 'base64');
                fs.writeFileSync('./session/creds.json', buffer.toString());
                console.log(chalk.green('✅ Session ID successfully loaded!'));
            } catch (e) {
                console.log(chalk.red('❌ Session ID conversion failed: ' + e.message));
            }
        }
        // --- SESSION ID HANDLING END ---

        let { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            // സെഷൻ ഐഡി ഉണ്ടെങ്കിൽ ക്യുആർ കാണിക്കേണ്ടതില്ല
            printQRInTerminal: !process.env.SESSION_ID,
            browser: ["LIZA-AI", "Chrome", "1.0.0"],
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
                await XeonBotInc.sendMessage(botNumber, { 
                    text: `🤖 *LIZA-AI is Live!*\n\nConnected successfully.\n*Developer:* (hank!nd3 p4d4y41!)` 
                });
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldReconnect) {
                    console.log(chalk.red('❌ Connection lost. Reconnecting...'))
                    startXeonBotInc()
                } else {
                    console.log(chalk.red('❌ Logged out. Delete session folder and use new Session ID.'));
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
                await handleMessages(XeonBotInc, chatUpdate)
            } catch (err) {
                console.error('Error in upsert:', err)
            }
        })

        XeonBotInc.ev.on('group-participants.update', async (anu) => {
            await handleGroupParticipantUpdate(XeonBotInc, anu)
        })

        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        XeonBotInc.public = settings.MODE === 'public' ? true : false

        return XeonBotInc
    } catch (error) {
        console.error('Fatal Error:', error)
        await delay(5000)
        startXeonBotInc()
    }
}

startXeonBotInc()
