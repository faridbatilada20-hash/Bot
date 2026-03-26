const fs = require("fs")
const dbPath = "./database/users.json"

if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}")

function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath))
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function addUser(id) {
  let db = loadDB()
  if (!db[id]) {
    db[id] = { uang: 0 }
    saveDB(db)
  }
}

module.exports = { loadDB, saveDB, addUser }
