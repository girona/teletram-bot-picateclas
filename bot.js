require("dotenv").config()

const { Telegraf } = require("telegraf")
const { Topics, TopicsList } = require("./topics")
const wait = hores => new Promise(resolve => setTimeout(resolve, hores * 60 * 60 * 1000))
const News = require("./news")
const DB = require("./fake_db")
const bot = new Telegraf(process.env.BOT_TOKEN)
const chatId = process.env.CHAT_ID
const dayjs = require("dayjs")

bot.start(ctx => ctx.reply("Bot iniciat!"))

/*
Apunts interessants...

bot.on("sticker", ctx => ctx.reply("👍"))

bot.hears("hi", ctx => ctx.reply("Hey there"))

bot.telegram.getMe().then(botInfo => {
  console.log(botInfo)
  bot.options.username = botInfo.username
})
*/

/*
  SALUTACIONS DE TESTING
  He pensat que aixo ho podem usar per testejar els valors de ctx.
  Seria interessant posar-hi una condicio que ens limiti a Eudald/Marc/Josep)
*/

bot.hears("saluda", ctx => {
  console.log("saludant")
  ctx.reply("He enviat salutacio de proba")
})

bot.hears("saluda_picateclas", ctx => {
  console.log("saludant al chat")
  ctx.telegram.sendMessage(chatId, "Salutacions desde el bot")
})

Topics(bot)

const main = async () => {
  for (;;) {
    const urls = ["", ""]
    for (let news_id of Object.keys(News)) {
      let news_items = []
      try {
        news_items = await News[news_id]()
      } catch (error) {}
      for (let item of news_items)
        if (TopicsList.some(topic => item.title.trim().toLowerCase().includes(topic))) {
          DB.add(item.link)
          try {
            await bot.telegram.sendMessage(chatId, item.link)
            console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} : Enviant: ${item.link}`)
          } catch (err) {
            console.error("PROBLEMA AL ENVIAR MISSATJE:")
            console.error(err)
          }
        }
    }
    await wait(2)
  }
}

bot
  .launch()
  .then(() => console.log(`TELEGRAM BOT: "${chatId}" running...`))
  .catch(error => console.error(error))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

main()
