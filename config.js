require('dotenv').config();

// ബോട്ടിന്റെ പ്രധാന സെറ്റിംഗ്സ്
global.owner = process.env.OWNER_NUMBER || '91XXXXXXXXXX'; 
global.prefix = process.env.PREFIX || '.'; 
global.mode = process.env.MODE || 'public'; 

/**
 * PREFIX_MODE സെറ്റിംഗ്സ്:
 * 'hybrid'    - Prefix ഉപയോഗിച്ചും ഇല്ലാതെയും കമാൻഡ് വർക്ക് ആകും (ഉദാ: .menu, menu)
 * 'prefix'    - Prefix ഉണ്ടെങ്കിൽ മാത്രമേ വർക്ക് ആകൂ (ഉദാ: .menu മാത്രം)
 * 'no-prefix' - Prefix ഇല്ലാതെ മാത്രമേ വർക്ക് ആകൂ (ഉദാ: menu മാത്രം)
 */
global.prefix_mode = process.env.PREFIX_MODE || 'hybrid'; 

global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

module.exports = {
    SESSION_ID: process.env.SESSION_ID || '', 
    OWNER_NUMBER: global.owner,
    ownerNumber: global.owner,
    PREFIX: global.prefix,
    prefix: global.prefix,
    MODE: global.mode,
    mode: global.mode,
    PREFIX_MODE: global.prefix_mode, // പുതിയ മോഡ് ഇവിടെ ചേർത്തു
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: global.APIKeys,
    packname: "LIZA-AI",
    author: "(hank!nd3 p4d4y41!)"
};
