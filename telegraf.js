const fs = require("fs")
const { Telegraf } = require("telegraf");

const oyen = new Telegraf(process.env.TELEGRAM_API_KEY)

const timestamp = () => {
  let now = new Date()
  let hour = now.getHours()
  let minute
  let second
  let AMPM

  hour < 12 ? AMPM = "AM" : AMPM = "PM"
  now.getMinutes() < 10 ? minute = "0" + now.getMinutes() : minute = now.getMinutes()
  now.getSeconds() < 10 ? second = "0" + now.getSeconds() : second = now.getSeconds()

  return `${hour}:${minute}:${second} ${AMPM}`
}

const config = () => {
  send(fs.readFileSync(".env", "utf-8"))
}

const account = () => {
  send(fs.readFileSync("accounts.json", "utf-8"))
}

const send = (message) => {
  try { oyen.telegram.sendMessage(process.env.GROUP_DEFAULT, message) }
  catch { console.log("Failed to send message !") }
}

module.exports = { account, timestamp, oyen, send, config }