const fs = require("fs")
const path = require("path")
const config = require("../config")

const commands = new Map()
const files = fs.readdirSync(path.join(__dirname, "../command"))

for (let file of files) {
  let cmd = require(`../command/${file}`)
  commands.set(cmd.name, cmd)
}

async function handleMessage(sock, msg) {
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
  if (!text) return

  if (!text.startsWith(config.prefix)) return

  const args = text.slice(1).trim().split(" ")
  const cmdName = args.shift().toLowerCase()

  const command = commands.get(cmdName)
  if (!command) return

  command.run(sock, msg, args)
}

module.exports = { handleMessage }
