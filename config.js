require('dotenv').config();

// ബോട്ടിന്റെ പ്രധാന സെറ്റിംഗ്സ്
global.owner = process.env.OWNER_NUMBER || '91XXXXXXXXXX'; // നിങ്ങളുടെ നമ്പർ ഇവിടെ വരും
global.prefix = process.env.PREFIX || '.'; // ബോട്ട് കമാൻഡ് തുടങ്ങേണ്ട ചിഹ്നം
global.mode = process.env.MODE || 'public'; // ബോട്ട് പബ്ലിക് ആണോ പ്രൈവറ്റ് ആണോ എന്ന്

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

// ഇവിടെയാണ് മാറ്റങ്ങൾ വരുത്തിയിരിക്കുന്നത്
module.exports = {
    SESSION_ID: process.env.SESSION_ID || '', 
    OWNER_NUMBER: global.owner,
    ownerNumber: global.owner, // മറ്റു ഫയലുകൾക്ക് വേണ്ടിയുള്ളത്
    PREFIX: global.prefix,
    prefix: global.prefix,     // മറ്റു ഫയലുകൾക്ക് വേണ്ടിയുള്ളത്
    MODE: global.mode,
    mode: global.mode,         // മറ്റു ഫയലുകൾക്ക് വേണ്ടിയുള്ളത്
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: global.APIKeys
};
