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

        const parts = userMessage.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (command !== 'gemini') return;

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "ഹലോ! ഞാൻ LIZA-AI. ചോദിക്കാനുള്ളത് ടൈപ്പ് ചെയ്യൂ.\n*ഉദാ:* gemini പ്രണയത്തെ കുറിച്ച് ഒരു കവിത പറയൂ"
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        try {
            const API_KEY = "AIzaSyBew1J5BUMYROrw713zqeTkFrL2g11aVII";
            // പുതിയ സ്റ്റേബിൾ ലിങ്ക് (v1) ഉപയോഗിക്കുന്നു
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    contents: [{ parts: [{ text: query }] }]
                }
            );

            if (response.data && response.data.candidates && response.data.candidates[0].content) {
                const answer = response.data.candidates[0].content.parts[0].text;
                const finalResponse = `🤖 *LIZA-AI GEMINI*\n\n${answer}\n\n*Powered by Unique Hacker*`;

                await sock.sendMessage(chatId, { text: finalResponse }, { quoted: message });
                await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
            }

        } catch (error) {
            console.error('Gemini API Error:', error.response ? error.response.data : error.message);
            await sock.sendMessage(chatId, { text: "❌ കണക്ഷൻ പ്രശ്നം! അല്പസമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കൂ." }, { quoted: message });
        }
    } catch (error) {
        console.error('AI Command Error:', error);
    }
}

module.exports = aiCommand;
