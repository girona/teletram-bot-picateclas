const links = {};

const db = {
    exist: (link) => {
        return links[link] != null
    },
    add: (link) => {
        links[link] = true;
    }
}

module.exports = db;