const fs = require("fs")
const { send, sendOyen, timestamp } = require("./telegraf")

const file = "./accounts.json"

let counter = 0
let status = {}

const connect = async (name, username, userid, SPCU, SPCC) => {
  await fetch('https://games.shopee.co.id/farm/api/orchard/resource/get', { headers: { 'Cookie': `userid=${userid}; username=${username}; SPC_U=${SPCU}; SPC_EC=${SPCC};`} })
  .then((res) => res.json())
  .then((res) => status[name].tetes = res.data.resource[0].number)
  .catch((err) => console.log(`Failed to get data (${username}) (Shopee) !\n\n`, err))
}

const checkShopee = (cmd) => {
  let total = 0
  
  let data = JSON.parse(fs.readFileSync(file, "utf-8"))
  let msg = `# Process ${counter}, ${timestamp()}\n\n`
  
  data.forEach((item) => {
    const { name, username, userid, SPCU, SPCC } = item
    if (!status[name]) status[name] = { tetes: 0, username, userid, SPCU, SPCC, panen: 0 }
    connect(name, username, userid, SPCU, SPCC)
  });

  for (const x in status) {
    let cookie = `userid=${status[x].userid}; username=${status[x].username}; SPC_U=${status[x].SPCU}; SPC_EC=${status[x].SPCC};`

    if (status[x].tetes < 15) {
      msg += "😑 "
    } else if (status[x].tetes > 15 && status[x].tetes < 25) {
      msg += "🤣 "
    } else {
      msg += "😍 "
    }

    msg += `${status[x].tetes} tetes, ${x} (${status[x].username.slice(0, 18)})\n`
    total += status[x].tetes

    if (status[x].tetes >= process.env.SHOPEE_MAX_TETES) {
      water(x, cookie)
    }
  }

  cmd === "status" ? send(`${msg}\n(total ${total} tetes) from ${data.length} account`) : console.log(msg, "\n(total ", total, "tetes) from ", data.length, "account\n\n")
  counter++
}

const water = (name, cookie) => {
  fetch('https://games.shopee.co.id/farm/api/orchard/crop/water', { method: 'POST', headers: { 'Cookie': `${cookie}`} })
  .then((res) => res.json())
  .then((res) => {
    if (res.msg === "invalid crop state") {
      if (status[name].panen < 1) {
        send(`🐱 Sepertinya ${name} panen!\n\n${timestamp()}, process ${counter}x`)
      } else if (status[name].panen === 2) {
        send(`🐱 Oiiii ${name} cek taneman cepetan!\n\n${timestamp()}, process ${counter}x`)
      }
      status[name].panen++
    } else {
      status[name].tetes = 0
      sendOyen(`🐱 Oyennn yang baik hati memberkati tanaman ${name}!\n\n${timestamp()}, process ${counter}x`)
    }
  })
  .catch(() => console.log(`Failed to siram (${name}), connection error!`))
}

const shopee = () => {
  setInterval(() => checkShopee(), process.env.SHOPEE_INTERVAL)
}

module.exports = { shopee, checkShopee }