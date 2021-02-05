const mongoose = require("mongoose")

const WebsiteSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        url: {type: String, required: true, unique: true},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Website", WebsiteSchema, "websites")
