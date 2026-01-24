/// Copyright @(hank!nd3 p4d4y41!)
const settings = require('../config');

async function aliveCommand(sock, chatId, m) {
    try {
        console.log("--- Sending Simple Alive Response ---");

        const aliveMsg = `*L I Z A  —  A I* ✅\n\n` +
                         `_System is running smoothly_\n\n` +
                         `◈ *Owner:* (hank!nd3 p4d4y41!)\n` +
                         `◈ *Status:* Online\n\n` +
                         `_Type .menu to see more_`;

        // യാതൊരുവിധ അധിക സെറ്റിംഗ്സും ഇല്ലാതെ വെറും ടെക്സ്റ്റ് മാത്രം അയക്കുന്നു
        await sock.sendMessage(chatId, { text: aliveMsg }, { quoted: m });

        console.log("✅ Simple Alive message sent!");

    } catch (error) {
        console.error('Error sending alive message:', error);
    }
}

module.exports = aliveCommand;
