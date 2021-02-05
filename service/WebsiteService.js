const Website = require('../models/Website');
const UrlService = require('./UrlService');

let WebsiteService = (function () {
    async function addWebsite(name, url) {
        if(!name || name.length === 0) { return;}
        if(!url || url.length === 0) {return;}
        if(!await UrlService.isAValidUrl(url)) { return;}
        await Website.create({name, url});
    }

    async function removeWebsite(name) {
        await Website.findOneAndDelete({name});
    }

    async function getAll() {
        return (await Website.find({}));
    }

    return {
        addWebsite: addWebsite,
        removeWebsite: removeWebsite,
        getAll: getAll,
    };
})();
module.exports = WebsiteService;
