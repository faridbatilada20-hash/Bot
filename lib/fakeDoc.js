const { Buffer } = require("buffer");

// Fungsi buat ucapan otomatis
function getUcapan() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

// Fungsi kirim fake document tanpa file
async function sendFakeDoc(sock, jid) {
  const ucapan = getUcapan();

  // Buat buffer kosong (cuma untuk “menipu” WA)
  const buffer = Buffer.from("Ini cuma fake document", "utf-8");

  await sock.sendMessage(jid, {
    document: buffer,
    fileName: ucapan + ".pdf",
    mimetype: "application/pdf",
  });

  console.log(`✅ Fake document "${ucapan}.pdf" dikirim ke ${jid}`);
}

module.exports = { sendFakeDoc };
