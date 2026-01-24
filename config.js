require('dotenv').config();

// ബോട്ടിന്റെ പ്രധാന സെറ്റിംഗ്സ്
global.owner = process.env.OWNER_NUMBER || '918075379950'; 
global.prefix = process.env.PREFIX || '.'; 
global.mode = process.env.MODE || 'public'; 
global.prefix_mode = process.env.PREFIX_MODE || 'hybrid'; 

module.exports = {
    SESSION_ID: process.env.SESSION_ID || '', 
    OWNER_NUMBER: global.owner,
    PREFIX: global.prefix,
    MODE: global.mode,
    PREFIX_MODE: global.prefix_mode,
    WARN_COUNT: 3,
    packname: "LIZA-AI",
    // നിങ്ങളുടെ ക്രെഡിറ്റ് ഇവിടെ നൽകിയിട്ടുണ്ട്
    author: "(hank!nd3 p4d4y41!)", 
    
    // APIs 
    APIs: {
        lol: 'https://api.lolhuman.xyz',
        fgmods: 'https://api-fgmods.ddns.net'
    },
    APIKeys: {
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};
