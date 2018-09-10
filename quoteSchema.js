const mongoose = require('mongoose')

const quoteSchema = mongoose.Schema({
  author: {type: String, required: true},
  quote: {type: String, required: true},
  server: {type: String, required: true}
})

const Quote = mongoose.model('Quote', quoteSchema)

module.exports = Quote