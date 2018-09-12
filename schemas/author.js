const mongoose = require('mongoose')

const author = new mongoose.Schema({
  name: {type: String, required: true},
  server: {type: String, required: true},
})

const Author = mongoose.model('Author', author)

module.exports = Author