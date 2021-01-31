const mongoose = require("mongoose")

const ArticleSchema = mongoose.Schema(
  {
    url: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Article", ArticleSchema, "articles")
