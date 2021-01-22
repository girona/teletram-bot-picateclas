require("dotenv").config()

const { Telegraf } = require("telegraf")
const Parser = require("rss-parser")
const topics = require("./topics");
const wait = hores => new Promise(resolve => setTimeout(resolve, hores * 60 * 60 * 1000))
let parser = new Parser()
let items = []

const bot = new Telegraf(process.env.BOT_TOKEN)
const chatId = process.env.CHAT_ID;

const rssCheck = async () => {
  let feed = await parser.parseURL("http://feeds.weblogssl.com/genbeta")
  let new_items = feed.items.filter(item => items.map(it => it.link).includes(item.link))
  for (const item of new_items) {
    console.log(`${item.title} : ${item.link}`)
    bot.telegram.sendMessage(chatId, `${item.title} : ${item.link}`)
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
  console.log("saludant")
  ctx.reply("buuuu")
  ctx.telegram.sendMessage(chatId, "Salutacions desde el bot")
})

topics(bot);

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

main()
