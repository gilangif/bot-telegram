const { timestamp, send } = require("./telegraf")


const getID = (message) => { 
  if (!message.split(" ")[1]) {
    send("Please add youtube URL after /description !")
  } else {
    const regex = message.split(" ")[1].match(/^(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|v\/|\.be\/)|\.be\/)([\w\-_]+)(?:\S+)?$/);
  
    if (!regex) { 
      send("Invalid description URL!") 
    } else { 
      return regex[1]
    }
  }
}

const youtube = (cmd, message) => {
  const id = getID(message)

  if (cmd === "comment") {
    send(`# DANA on comment target (${process.env.YOUTUBE_COMMENT_TARGET})\n(loop ${process.env.YOUTUBE_MAX}x, interval ${process.env.YOUTUBE_INTERVAL}ms)\n\nhttp://youtube.com/watch?v=${id}`)
    comment(id)
  } else if (cmd === "decription") {
    send(`# DANA on description\n(loop ${process.env.YOUTUBE_MAX}x, interval ${process.env.YOUTUBE_INTERVAL}ms)\n\nhttp://youtube.com/watch?v=${id}`)
    description(id)
  }
}

const comment = (id) => {
  let check = 0
  let count = 0
  let link = []

  console.log(`\n# START ${timestamp()}\n\n`);

  const loop = setInterval(() => {
    if (count > process.env.YOUTUBE_MAX) {
      send(`Program stopped ${timestamp()} !`)
      console.log(`\n#STOPPED ${timestamp()}\n\n`);
      return clearInterval(loop)
    }

    fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=${process.env.YOUTUBE_KEY}&textFormat=plainText&part=snippet&videoId=${id}`)
    .then((res) => res.json())
    .then((res) => {
      let find = res.items.find((item) => item.snippet.topLevelComment.snippet.authorDisplayName === process.env.YOUTUBE_COMMENT_TARGET)
      if (!find) return send(`Cannot find target name (${process.env.YOUTUBE_COMMENT_TARGET}) on comment !`)
      else {
        let matches = find.snippet.topLevelComment.snippet.textOriginal.match(/https?:\/\/link\.dana\S+/g)
        if (matches) {
          if (matches.length > link.length) send(`Lists:\n${matches.join("\n")}\n\n\n\nUpdate (${timestamp()}):\n${matches[matches.length-1]}`)
          link = matches
        }
      }
    })
    .catch(() => {
      if (check < 2) send("Connection failed or reach max api request limit (comment) !")
      check++
    })
    console.log(count, "command (comment), result:", link.length, "link");
    count++
  }, process.env.YOUTUBE_INTERVAL)
}

//
//
//

const description = (id) => {
  let check = 0
  let count = 0
  let link = []

  console.log(`\n# START ${timestamp()}\n\n`);

  const loop = setInterval(() => {
    if (count > process.env.YOUTUBE_MAX) {
      send(`Program stopped ${timestamp()} !`)
      console.log(`\n#STOPPED ${timestamp()}\n\n`);
      return clearInterval(loop)
    }

    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      let matches = res.items[0].snippet.description.match(/https?:\/\/link\.dana\S+/g);
      if (matches) {
        if (matches.length > link.length) send(`Lists:\n${matches.join("\n")}\n\n\n\nUpdate (${timestamp()}):\n${matches[matches.length-1]}`)
        link = matches
      } 
    })
    .catch(() => {
      if (check < 2) send("Connection failed or reach max api request limit (description) !")
      check++
    })
    console.log(count, "command (description), result:", link.length, "link");
    count++
  }, process.env.YOUTUBE_INTERVAL)
}

module.exports = { youtube }

