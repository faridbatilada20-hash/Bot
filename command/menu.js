const { sendFakeDoc } = require("../lib/fakeDoc")
const { loadDB, addUser } = require("../src/database")
const config = require("../config")

module.exports = {
  name: "menu",
  run: async (sock, msg) => {

    const sender = msg.key.remoteJid
    const pushName = msg.pushName || "User"
    const idUser = sender.split("@")[0]

    addUser(idUser)
    let db = loadDB()

    const now = new Date()
    const jam = now.getHours()

    let ucapan = ""
    if (jam < 12) ucapan = "Selamat Pagi 🌅"
    else if (jam < 15) ucapan = "Selamat Siang ☀️"
    else if (jam < 18) ucapan = "Selamat Sore 🌇"
    else ucapan = "Selamat Malam 🌙"

    const date = now.toLocaleDateString("id-ID")
    const day = now.toLocaleDateString("id-ID", { weekday: "long" })
    const time = now.toLocaleTimeString("id-ID")

    const teks = `╭──❍「 *𝑈𝑆𝐸𝑅 𝐼𝑁𝐹𝑂* 」❍
├ *𝑁𝑎𝑚𝑎* : ${pushName}
├ *𝐼𝑑* : @${idUser}
├ *𝑈𝑠𝑒𝑟* : VIP
├ *𝐿𝑖𝑚𝑖𝑡* : VIP
├ *𝑈𝑎𝑛𝑔* : ${db[idUser].uang}
╰─┬────❍
╭─┴─❍「 *𝐵𝑂𝑇 𝐼𝑁𝐹𝑂* 」❍
├ *𝑁𝑎𝑚𝑎 𝐵𝑜𝑡* : ${config.botName}
├ *𝑃𝑜𝑤𝑒𝑟𝑒𝑑* : WhatsApp
├ *𝑂𝑤𝑛𝑒𝑟* : ${config.owner}
├ *𝑀𝑜𝑑𝑒* : ${config.mode}
├ *𝑃𝑟𝑒𝑓𝑖𝑥* : ${config.prefix}
╰─┬────❍
╭─┴─❍「 *𝐴𝐵𝑂𝑈𝑇* 」❍
├ *𝐷𝑎𝑡𝑒* : ${date}
├ *𝐷𝑎𝑦* : ${day}
├ *𝑇𝑖𝑚𝑒* : ${time}
╰──────❍
╭──❍「 *𝑇𝑂𝑃 𝑀𝐸𝑁𝑈* 」❍
│➤ .claim
│➤ .ping
│➤ .speed
│➤ .profile
╰──────❍`

    await sendFakeDoc(sock, sender, teks, ucapan)
  }
}
