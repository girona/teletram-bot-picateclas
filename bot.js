require("dotenv").config()

const { Telegraf } = require("telegraf")
const Parser = require("rss-parser")
const topics = require("./topics")
const wait = hores => new Promise(resolve => setTimeout(resolve, hores * 60 * 60 * 1000))
let parser = new Parser()
let items = []

const bot = new Telegraf(process.env.BOT_TOKEN)

const rssCheck = async () => {
  let feed = await parser.parseURL("http://feeds.weblogssl.com/genbeta")
  console.log(feed.title)
  feed.items
  let new_items = feed.items.filter(item => items.map(it => it.link).includes(item.link))
  for (const item in new_items) {
    console.log(`${item.title} : ${item.link}`)
    bot.telegram.sendMessage("@picateclas", `${item.title} : ${item.link}`)
    await wait(2)
  }
  items = feed.items
}

bot.start(ctx => ctx.reply("Bot iniciat!"))

/*

bot.on("sticker", ctx => ctx.reply("👍"))

bot.hears("hi", ctx => ctx.reply("Hey there"))

bot.telegram.getMe().then(botInfo => {
  console.log(botInfo)
  bot.options.username = botInfo.username
})
*/

bot.hears("saluda", ctx => {
  console.log(ctx.update.message.from.username + " saluda")
  ctx.reply("buuuu ")
  ctx.telegram.sendMessage("@picateclas", `${ctx.update.message.from.username} saluda desde el bot`)
})

bot.hears("uff", ctx => {
  console.log(ctx.telegram.getChatMember("@picateclas"))
  ctx.reply("uff")
})

topics(bot)

const main = async () => {
  for (;;) {
    await rssCheck()
  }
}

bot
  .launch()
  .then(() => console.log("running..."))
  .catch(error => console.error(error))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

//main()
