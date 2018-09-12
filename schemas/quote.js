const mongoose = require('mongoose')
const Author = require('./author')

const quote = new mongoose.Schema({
  author: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
  quote: {type: String, required: true},
})

const Quote = mongoose.model('Quote', quote)

module.exports = Quote