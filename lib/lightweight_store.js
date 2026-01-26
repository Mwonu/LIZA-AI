/**
 * LIZA-AI Lightweight Store
 * Optimized for Railway (Low RAM)
 * Developer: Chank!nd3 p4d4y41!
 */
const fs = require('fs')
const path = require('path')
const STORE_FILE = path.join(process.cwd(), 'baileys_store.json')

let MAX_MESSAGES = 20

// Config: settings ഫയലിൽ നിന്ന് മാക്സിമം മെസ്സേജ് ലിമിറ്റ് എടുക്കുന്നു
try {
    const settings = require('../config.js') // നിങ്ങളുടെ ഫയൽ പേര് config.js എന്നാണല്ലോ
    if (settings.maxStoreMessages && typeof settings.maxStoreMessages === 'number') {
        MAX_MESSAGES = settings.maxStoreMessages
    }
} catch (e) {
    // Settings ലോഡ് ആയില്ലെങ്കിൽ ഡിഫോൾട്ട് 20 തന്നെ ഉപയോഗിക്കും
}

const store = {
    messages: {},
    contacts: {},
    chats: {},

    readFromFile(filePath = STORE_FILE) {
        try {
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf-8');
                if (!rawData) return; // ഫയൽ കാലിയാണെങ്കിൽ ഒന്നും ചെയ്യണ്ട
                
                const data = JSON.parse(rawData)
                this.contacts = data.contacts || {}
                this.chats = data.chats || {}
                this.messages = data.messages || {}
                
                this.cleanupData()
                console.log('✅ Store loaded successfully! (Chank!nd3 p4d4y41!)')
            }
        } catch (e) {
            console.warn('⚠️ Store Read Error:', e.message)
            // ഫയൽ കറപ്റ്റ് ആയാൽ ബാക്കപ്പ് എടുക്കുകയോ റീസെറ്റ് ചെയ്യുകയോ ചെയ്യാം
        }
    },

    writeToFile(filePath = STORE_FILE) {
        try {
            const data = JSON.stringify({
                contacts: this.contacts,
                chats: this.chats,
                messages: this.messages
            }, null, 2)
            
            // നേരിട്ട് ഫയലിലേക്ക് എഴുതുന്നതിന് പകരം താൽക്കാലികമായി എഴുതി സേവ് ചെയ്യുന്നു (Atomic Write)
            fs.writeFileSync(filePath, data)
        } catch (e) {
            console.warn('⚠️ Store Write Error:', e.message)
        }
    },

    cleanupData() {
        if (this.messages) {
            Object.keys(this.messages).forEach(jid => {
                if (Array.isArray(this.messages[jid])) {
                    if (this.messages[jid].length > MAX_MESSAGES) {
                        this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
                    }
                } else if (typeof this.messages[jid] === 'object') {
                    // പഴയ ഫോർമാറ്റ് ആണെങ്കിൽ മാറ്റുന്നു
                    const messages = Object.values(this.messages[jid])
                    this.messages[jid] = messages.slice(-MAX_MESSAGES)
                }
            })
        }
    },

    bind(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            messages.forEach(msg => {
                if (!msg.key?.remoteJid) return
                const jid = msg.key.remoteJid
                this.messages[jid] = this.messages[jid] || []

                this.messages[jid].push(msg)

                if (this.messages[jid].length > MAX_MESSAGES) {
                    this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
                }
            })
        })

        ev.on('contacts.update', (contacts) => {
            contacts.forEach(contact => {
                if (contact.id) {
                    this.contacts[contact.id] = {
                        id: contact.id,
                        name: contact.notify || contact.name || this.contacts[contact.id]?.name || ''
                    }
                }
            })
        })

        ev.on('chats.set', ({ chats }) => {
            chats.forEach(chat => {
                this.chats[chat.id] = { 
                    id: chat.id, 
                    subject: chat.subject || this.chats[chat.id]?.subject || '' 
                }
            })
        })
    },

    async loadMessage(jid, id) {
        return this.messages[jid]?.find(m => m.key.id === id) || null
    },

    getStats() {
        let totalMessages = 0
        Object.values(this.messages).forEach(chatMessages => {
            if (Array.isArray(chatMessages)) totalMessages += chatMessages.length
        })
        
        return {
            messages: totalMessages,
            contacts: Object.keys(this.contacts).length,
            chats: Object.keys(this.chats).length,
            maxPerChat: MAX_MESSAGES
        }
    }
}

module.exports = store
