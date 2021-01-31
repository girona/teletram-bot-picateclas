const mongoose = require("mongoose")

const connection = {}

module.exports = async () => {
  if (connection.isConnected) {
    return null
  }
  const db = await mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })

  connection.isConnected = db.connections[0].readyState
}
