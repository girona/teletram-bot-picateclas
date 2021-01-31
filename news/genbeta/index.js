const Parser = require("rss-parser")
const parser = new Parser()

module.exports = async () => {
  let feed = await parser.parseURL("http://feeds.weblogssl.com/genbeta")
  const serialized_items = feed.items.map(n => ({
    title: n.title,
    link: n.link
  }))
  return serialized_items
}
