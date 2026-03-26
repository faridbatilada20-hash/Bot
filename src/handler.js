const { sendFakeDoc } = require("../lib/fakeDoc")
const db = require("./database")

async function handleMessage(sock, msg) {
  const sender = msg.key.remoteJid
  const pushName = msg.pushName || "User"
  const id = sender.split("@")[0]

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    ""

  // ===== INIT USER =====
  if (!db[id]) {
    db[id] = {
      uang: 0,
      lastClaim: 0
    }
  }

  // ===== MENU =====
  if (text === ".menu") {
    const now = new Date()
    const jam = now.getHours()

    let ucapan = ""
    if (jam < 12) ucapan = "Selamat Pagi 🌅"
    else if (jam < 15) ucapan = "Selamat Siang ☀️"
    else if (jam < 18) ucapan = "Selamat Sore 🌇"
    else ucapan = "Selamat Malam 🌙"

    const teks = `╭──❍「 USER INFO 」❍
├ Nama : ${pushName}
├ Id : @${id}
├ User : VIP
├ Limit : VIP
├ Uang : ${db[id].uang}
╰──|──❍
╭──❍「 BOT INFO 」❍
├ Nama Bot : pan bot
├ Owner : +62-838-8407-448
├ Mode : Public
├ Prefix : .
╰──|─❍
╭──❍「 MENU 」❍
│➤ .claim
│➤ .ping
│➤ .rvo
╰────❍`

    await sendFakeDoc(sock, sender, `${ucapan}\n\n${teks}`, "Menu Bot")
  }

  // ===== CLAIM =====
  if (text === ".claim") {
    const now = Date.now()
    const cooldown = 86400000

    if (now - db[id].lastClaim < cooldown) {
      const sisa = cooldown - (now - db[id].lastClaim)
      const jam = Math.floor(sisa / 3600000)
      return sock.sendMessage(sender, {
        text: `⏳ Tunggu ${jam} jam lagi`
      })
    }

    const reward = 10000
    db[id].uang += reward
    db[id].lastClaim = now

    return sock.sendMessage(sender, {
      text: `💰 Kamu dapat ${reward}\nTotal uang: ${db[id].uang}`
    })
  }

  // ===== PING =====
  if (text === ".ping") {
    const start = Date.now()

    await sock.sendMessage(sender, { text: "🏓 Pong..." })

    const end = Date.now()
    const speed = end - start

    await sock.sendMessage(sender, {
      text: `⚡ Speed: ${speed} ms`
    })
  }

  // ===== RVO =====
  if (text === ".rvo") {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

      if (!quoted) {
        return sock.sendMessage(sender, {
          text: "Reply foto/view once dengan .rvo"
        })
      }

      let imageMessage =
        quoted.imageMessage ||
        quoted.viewOnceMessageV2?.message?.imageMessage ||
        quoted.viewOnceMessage?.message?.imageMessage

      if (!imageMessage) {
        return sock.sendMessage(sender, {
          text: "Itu bukan foto!"
        })
      }

      const stream = await sock.downloadContentFromMessage(imageMessage, "image")
      let buffer = Buffer.from([])

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }

      await sock.sendMessage(sender, {
        image: buffer,
        caption: "✅ Nih fotonya (udah jadi biasa)"
      })

    } catch (err) {
      console.log(err)
      sock.sendMessage(sender, { text: "❌ Error ambil foto" })
    }
  }
}

module.exports = { handleMessage }
