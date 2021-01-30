require("dotenv").config()

const { Telegraf } = require("telegraf")
const {Topics, TopicsList} = require("./topics");
const wait = hores => new Promise(resolve => setTimeout(resolve, hores * 60 * 60 * 1000))
const News = require('./news')
const DB = require('./fake_db')
const bot = new Telegraf(process.env.BOT_TOKEN)
const chatId = process.env.CHAT_ID


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

Topics(bot);

const main = async () => {
  for (;;) {
    let news_items = await News.genbetaNews() 
    let news_items = [...await news.genbetaNews(), ...await news.devNews()]
    for(let n of news_items.slice(1, 2)) { //només 1 noticia
      if(TopicsList.some(topic => n.title.includes(topic))) {
        DB.add(n.link);
        bot.telegram.sendMessage(chatId, n.link)
            .catch((err) => console.log(err))
      } 
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
