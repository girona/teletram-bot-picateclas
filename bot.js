require("dotenv").config()

const { Telegraf } = require("telegraf")
const topics = require("./topics");
const news = require('./news')
const db = require('./fake_db')
const bot = new Telegraf(process.env.BOT_TOKEN)
const chatId = process.env.CHAT_ID;
const wait = hores => new Promise(resolve => setTimeout(resolve, parseInt(process.env.HORES) * 60 * 60 * 1000))

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
    let news_items = [...await news.genbetaNews(), ...await news.devNews()]
    for(let n of news_items.slice(1, 2)) { //només 1 noticia
        db.add(n.link);
        bot.telegram.sendMessage(chatId, n.link)
            .catch((err) => console.log(err))
    }
    await wait(2)
  }
}

bot
  .launch()
  .then(() => console.log("running..."))
  .catch(error => console.error(error))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

main()
