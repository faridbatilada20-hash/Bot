const { loadDB, saveDB, addUser } = require("../src/database")

const cooldown = {}

module.exports = {
  name: "claim",
  run: async (sock, msg) => {
    const sender = msg.key.remoteJid
    const id = sender.split("@")[0]

    addUser(id)
    let db = loadDB()

    const now = Date.now()

    if (cooldown[id] && now - cooldown[id] < 60000) {
      let sisa = Math.ceil((60000 - (now - cooldown[id])) / 1000)
      return sock.sendMessage(sender, {
        text: `⏳ Tunggu ${sisa} detik lagi untuk claim`
      })
    }

    cooldown[id] = now

    let uang = Math.floor(Math.random() * 10000) + 1000
    db[id].uang += uang
    saveDB(db)

    await sock.sendMessage(sender, {
      text: `🎁 Kamu dapat uang: ${uang}\n💰 Total: ${db[id].uang}`
    })
  }
}
