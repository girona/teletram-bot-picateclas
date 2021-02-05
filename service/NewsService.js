const Parser = require("rss-parser")
const parser = new Parser();


let NewsService = (function () {
    async function parseUrl(url) {
        let feed = await parser.parseURL(url)
        const serialized_items = feed.items.map(n => ({
            title: n.title,
            link: n.link
        }))
        return serialized_items
    }

    return {
        parseUrl: parseUrl
    };
})();

module.exports = NewsService;
