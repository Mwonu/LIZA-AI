/// Copyright @(hank!nd3 p4d4y41!
const axios = require('axios');

async function aiCommand(sock, chatId, message) {
    try {
        const userMessage = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            ''
        ).trim();

        // കമാൻഡ് പേര് വേർതിരിക്കുന്നു (Prefix ഇല്ലാതെ വർക്ക് ആകാൻ)
        const parts = userMessage.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        // കമാൻഡ് 'gemini' ആണോ എന്ന് നോക്കുന്നു (Prefix ഇല്ലാതെ)
        if (command !== 'gemini') return;

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "ഹലോ! ഞാൻ നിങ്ങളുടെ Gemini AI അസിസ്റ്റന്റ് ആണ്. എന്നോട് എന്തെങ്കിലും ചോദിക്കണമെങ്കിൽ കമാൻഡിനൊപ്പം ചോദ്യം കൂടി നൽകുക.\n\n*ഉദാഹരണത്തിന്:* gemini ലോകത്തിലെ ഏറ്റവും വലിയ രാജ്യം ഏതാണ്?"
            }, { quoted: message });
        }

        // Reaction - ചിന്തിക്കുന്നു എന്ന കാണിക്കാൻ
        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        try {
            const API_KEY = "AIzaSyBew1J5BUMYROrw713zqeTkFrL2g11aVII";
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    contents: [{ parts: [{ text: query }] }]
                }
            );

            if (response.data && response.data.candidates && response.data.candidates[0].content) {
                const answer = response.data.candidates[0].content.parts[0].text;
                
                // നിങ്ങളുടെ ബോട്ടിന്റെ ക്രെഡിറ്റ്സ് ചേർക്കുന്നു
                const finalResponse = `🤖 *LIZA-AI GEMINI*\n\n${answer}\n\n*Powered by LIZA-AI*`;

                await sock.sendMessage(chatId, {
                    text: finalResponse,
                    contextInfo: {
                        externalAdReply: {
                            title: "LIZA-AI SMART ASSISTANT",
                            body: "Gemini AI is active",
                            thumbnailUrl: "https://telegra.ph/file/your-image-link.jpg", // നിങ്ങളുടെ ബോട്ടിന്റെ ലോഗോ ലിങ്ക് ഉണ്ടെങ്കിൽ ഇവിടെ നൽകാം
                            sourceUrl: "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: message });

                // വിജയിച്ചു എന്ന് കാണിക്കാൻ Reaction മാറ്റുന്നു
                await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

            } else {
                throw new Error('Invalid response from Gemini');
            }

        } catch (error) {
            console.error('Gemini API Error:', error.response ? error.response.data : error.message);
            await sock.sendMessage(chatId, { text: "❌ ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ മറുപടി നൽകാൻ കഴിയുന്നില്ല. പിന്നീട് ശ്രമിക്കൂ." }, { quoted: message });
        }
    } catch (error) {
        console.error('AI Command Error:', error);
    }
}

module.exports = aiCommand;
