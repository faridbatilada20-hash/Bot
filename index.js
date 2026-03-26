const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const readline = require("readline")
const { handleMessage } = require("./src/handler")

// ===== GANTI NOMOR TARGET =====
const OWNER_NUMBER = "628388407448@s.whatsapp.net"

// ===== PILIH MEDIA =====
const MEDIA = {
  type: "video",
  url: "https://files.catbox.moe/18d7b6.mp4"
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(text) {
  return new Promise(resolve => rl.question(text, resolve))
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version
  })

  sock.ev.on("creds.update", saveCreds)

  // ===== PAIRING =====
  if (!sock.authState.creds.registered) {
    let nomor = await question("Masukkan nomor WhatsApp (contoh: 628xxx): ")
    nomor = nomor.replace(/[^0-9]/g, "")

    const code = await sock.requestPairingCode(nomor)

    console.log("\n🔥 Pairing Code Kamu:")
    console.log(code)
    console.log("Masukkan ke WhatsApp > Perangkat Tertaut\n")

    rl.close()
  }

  // ===== CONNECTION =====
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode

      console.log("❌ Koneksi putus:", reason)

      if (reason === DisconnectReason.loggedOut) {
        console.log("⚠️ Logout, hapus session dulu")
      } else {
        console.log("🔄 Reconnect 5 detik...")
        setTimeout(() => startBot(), 5000)
      }

    } else if (connection === "open") {
      console.log("✅ Bot berhasil connect!")

      // ===== AUTO KIRIM MEDIA =====
      try {
        if (MEDIA.type === "image") {
          await sock.sendMessage(OWNER_NUMBER, {
            image: { url: MEDIA.url },
            caption: "🤖 Bot berhasil aktif!"
          })
        } else if (MEDIA.type === "video") {
          await sock.sendMessage(OWNER_NUMBER, {
            video: { url: MEDIA.url },
            caption: "🤖 Bot berhasil aktif!"
          })
        }
      } catch (err) {
        console.log("Gagal kirim media:", err)
      }
    }
  })

  // ===== MESSAGE =====
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    handleMessage(sock, msg)
  })
}

startBot()
