const mongoose = require('mongoose')

const author = new mongoose.Schema({
  names: [{type: String, required: true}],
  server: {type: String, required: true},
})

const Author = mongoose.model('Author', author)

module.exports = Author