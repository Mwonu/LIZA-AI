/**
 * LIZA-AI - Optimized Utility Functions
 * Credit: (hank!nd3 p4d4y41!)
 */

const axios = require("axios")
const cheerio = require("cheerio")
const fs = require('fs')
const BodyForm = require('form-data')
const { unlink } = require('fs').promises
const path = require('path')

// താൽക്കാലിക ഫോൾഡർ ഉണ്ടെന്ന് ഉറപ്പാക്കുന്നു
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.fetchJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return { error: err.message }
    }
}

// ഇമേജ് ടെലിഗ്രാഫിലേക്ക് അപ്‌ലോഡ് ചെയ്യാൻ
exports.TelegraPh = (Path) => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
        try {
            const form = new BodyForm();
            form.append("file", fs.createReadStream(Path))
            const data = await axios({
                url: "https://telegra.ph/upload",
                method: "POST",
                headers: {
                    ...form.getHeaders()
                },
                data: form
            })
            return resolve("https://telegra.ph" + data.data[0].src)
        } catch (err) {
            return reject(new Error(String(err)))
        }
    })
}

exports.getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

exports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'gi'))
}
