// lib/fakeDoc.js

const fs = require("fs");
const path = require("path");

// Fungsi untuk menentukan ucapan sesuai waktu
function getUcapan() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

// Fungsi untuk mengirim fake document
async function sendFakeDoc(sock, jid) {
  const ucapan = getUcapan(); // dapetin ucapan otomatis
  const filePath = path.join(__dirname, "dummy.pdf"); // path ke file dummy kamu
  const buffer = fs.readFileSync(filePath);

  await sock.sendMessage(jid, {
    document: buffer,
    fileName: ucapan + ".pdf", // nama file sesuai ucapan
    mimetype: "application/pdf",
  });

  console.log(`✅ Fake document "${ucapan}.pdf" dikirim ke ${jid}`);
}

module.exports = { sendFakeDoc };
