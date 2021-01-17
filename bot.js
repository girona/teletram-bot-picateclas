require("dotenv").config()

const { Telegraf } = require("telegraf")

console.log(process.env.BOT_TOKEN)

/*
// EXEMPLE
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(ctx => ctx.reply("Welcome"))
bot.help(ctx => ctx.reply("Send me a sticker"))
bot.on("sticker", ctx => ctx.reply("👍"))
bot.hears("hi", ctx => ctx.reply("Hey there"))
bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
*/
