const Parser = require("rss-parser")
const db = require("../../fake_db")
const parser = new Parser()

module.exports = async () => {
  let feed = { items: [] }
  try {
    feed = await parser.parseURL("https://dev.to/feed/")
  } catch (error) {
    console.error(`Genbeta ERROR:`)
    console.error(error)
  }
  const new_items = feed.items
    .map(n => ({
      title: n.title,
      link: n.link
    }))
    .filter(n => !db.exist(n.link))
  return new_items
}
