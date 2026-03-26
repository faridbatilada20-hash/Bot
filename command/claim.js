const { loadDB, saveDB, addUser } = require("../src/database")

const COOLDOWN = 86400000 // 24 jam

module.exports = {
  name: "claim",
  run: async (sock, msg) => {
    const sender = msg.key.remoteJid
    const id = sender.split("@")[0]

    addUser(id)
    let db = loadDB()

    const now = Date.now()

    // kalau belum pernah claim
    if (!db[id].lastClaim) db[id].lastClaim = 0

    // cek cooldown
    if (now - db[id].lastClaim < COOLDOWN) {
      let sisa = COOLDOWN - (now - db[id].lastClaim)

      let jam = Math.floor(sisa / 3600000)
      let menit = Math.floor((sisa % 3600000) / 60000)

      return sock.sendMessage(sender, {
        text: `⏳ Kamu sudah claim!\nCoba lagi dalam ${jam} jam ${menit} menit`
      })
    }

    // update waktu claim
    db[id].lastClaim = now

    // kasih reward
    let uang = Math.floor(Math.random() * 10000) + 1000
    db[id].uang += uang

    saveDB(db)

    await sock.sendMessage(sender, {
      text: `🎁 Claim berhasil!\n💰 Uang: +${uang}\nTotal: ${db[id].uang}`
    })
  }
        }
