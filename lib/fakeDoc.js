async function sendFakeDoc(sock, jid, text, title) {
  await sock.sendMessage(jid, {
    document: Buffer.from("fake"),
    mimetype: "application/pdf",
    fileName: title,
    fileLength: 999999999999,
    pageCount: 999,
    caption: text
  })
}

module.exports = { sendFakeDoc }
