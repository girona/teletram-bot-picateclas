const Parser = require('rss-parser')
const db = require('../../fake_db')
const parser = new Parser()

const news = async () => {
    let feed = await parser.parseURL("https://dev.to/feed/")
    let new_items = feed.items.map(mapper).filter(filter)
  
    return new_items;
}

const mapper = (n) => {
    return {
      title: n.title,
      link: n.link    
    }
}

const filter = (n) => {
    return n => !db.exist(n.link)
} 

module.exports = news