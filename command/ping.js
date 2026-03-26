module.exports = {
  name: "ping",
  run: async (sock, msg) => {

    const start = Date.now()

    const sent = await sock.sendMessage(msg.key.remoteJid, {
      text: "Testing speed..."
    })

    const end = Date.now()

    const speed = end - start

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🏓 Pong!\n⚡ Speed: ${speed} ms`
    })
  }
}
