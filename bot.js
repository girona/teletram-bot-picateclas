require("dotenv").config()
const { Telegraf } = require("telegraf")
const { Topics, TopicsList } = require("./topics")
const wait = hores => new Promise(resolve => setTimeout(resolve, hores * 60 * 60 * 1000))
const News = require("./news")
const mongoose = require("mongodb")
const bot = new Telegraf(process.env.BOT_TOKEN)
const chatId = process.env.CHAT_ID
const dayjs = require("dayjs")
const Article = require("./models/Article")

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
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Mongo connected...")
  } catch (error) {
    console.error("PROBLEMES DE CONEXIO")
    console.error(error)
    process.exit(0)
  }

  for (;;) {
    for (let news_id of Object.keys(News)) {
      let news_items = []
      try {
        console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} -> SCRAPPING: ${news_id}`)
        news_items = await News[news_id]()
        for (let item of news_items) {
          try {
            let url = item.link.trim().toLowerCase()
            console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} -> ${url}`)
            await Article.create({ url })
            //await bot.telegram.sendMessage(chatId, url)
            console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} : Enviat: ${item.link}`)
          } catch (error) {
            console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} : Exists: ${item.link}`)
            console.log(error)
          }
          await wait(1)
        }
      } catch (error) {
        console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} : URL: ${news_id} PROBLEM`)
      }
      await wait(2)
    }
  }
}

bot
  .launch()
  .then(() => console.log(`TELEGRAM BOT: "${chatId}" running...`))
  .catch(error => console.error(error))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

main()
