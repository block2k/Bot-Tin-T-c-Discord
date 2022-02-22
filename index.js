const {
  Client,
  Intents
} = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const fetch = require("node-fetch")
const cron = require('node-cron');
const moment = require("moment")
const delay = require("delay")
const keepAlive = require("./server")
const exampleEmbed = {
  color: 0x0099ff,
  title: 'Some title',
  url: 'https://vnwallstreet.com/#/',
  author: {
    name: 'Đức Long',
    icon_url: 'https://i.imgur.com/AfFp7pu.png',
    url: 'https://www.facebook.com/bl0ck2k/',
  },
  description: 'Some description here',
  timestamp: new Date(),
  footer: {
    text: 'Phố Wall VN',
    icon_url: 'https://i.imgur.com/AfFp7pu.png',
  },
};

var otherId = "1";
var newOtherId = "2";

function getNews() {
  return fetch("https://vnwallstreet.com/api/inter/newsFlash/page?important=-1&limit=1&start=0&status=-1&uid=-1&time_=1645354313863&sign_=D7CA264A553C671A02DDA0FAA891EE8E")
    .then(res => {
      return res.json()
    })
    .then(data => {
      newOtherId = data.data[0]["createtime"]
      exampleEmbed.title = moment(data.data[0]["createtime"]).format("lll")
      exampleEmbed.description = data.data[0]["content"]
      exampleEmbed.timestamp = new Date()
      if (newOtherId == otherId) return

      const general = client.channels.cache.get('945129767575883816');
      general.send({ embeds: [exampleEmbed] })
      otherId = newOtherId

      // return moment(data.data[0]["createtime"]).format("lll") + " - " + data.data[0]["content"]
    })
}

client.on("messageCreate", msg => {
  if (msg.author.bot) return

  if (msg.content === "news") {
    getNews().then(quote => msg.channel.send(quote))
  }
})

const setSchedules = () => {
  // */10 * * * * *
  // * * * * *
  cron.schedule(`*/30 * * * * *`, () => {
    getNews()
  });
};

client.on('ready', setSchedules);

keepAlive()
client.login("OTQ0OTE1MjgyODA2MzEyOTcw.YhIi7w.wmS8JmtcJtDWYutPVLMGAxJ9Rn8")

