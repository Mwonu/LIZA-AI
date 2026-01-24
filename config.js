require('dotenv').config();

// ബോട്ടിന്റെ പ്രധാന സെറ്റിംഗ്സ്
global.owner = process.env.OWNER_NUMBER || '918075379950'; // നിങ്ങളുടെ നമ്പർ ഇവിടെ ഡിഫോൾട്ട് നൽകി
global.prefix = process.env.PREFIX || '.'; 
global.mode = process.env.MODE || 'public'; // ലോഗ് അനുസരിച്ച് 'public' ആക്കി
global.prefix_mode = process.env.PREFIX_MODE || 'hybrid'; 

module.exports = {
    SESSION_ID: process.env.SESSION_ID || '', 
    OWNER_NUMBER: global.owner,
    PREFIX: global.prefix,
    MODE: global.mode,
    PREFIX_MODE: global.prefix_mode,
    WARN_COUNT: 3,
    packname: "LIZA-AI",
    author: "(hank!nd3 p4d4y41!)",
    
    // APIs (ആവശ്യമെങ്കിൽ മാത്രം ഉപയോഗിക്കാൻ)
    APIs: {
        lol: 'https://api.lolhuman.xyz',
        fgmods: 'https://api-fgmods.ddns.net'
    },
    APIKeys: {
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};
