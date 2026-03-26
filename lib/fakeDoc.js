const axios = require("axios")

async function getBuffer(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" })
  return res.data
}

async function sendFakeDoc(sock, jid, text, title) {
  const thumbnail = await getBuffer("https://files.catbox.moe/h5tjq5.jpg") // foto atas

  await sock.sendMessage(jid, {
    document: Buffer.from("fake"),
    mimetype: "application/pdf",
    fileName: ucapan,
    title: ucapan,
    fileLength: 999999999,
    pageCount: 100,
    caption: text,
    contextInfo: {
      externalAdReply: {
        title: "pan bot",
        body: "Bot WhatsApp",
        thumbnail: thumbnail,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  })
}

module.exports = { sendFakeDoc }
