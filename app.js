const Discord = require('discord.js')
const mongoose = require('mongoose')
const config = require('./config.json')
const Quote = require('./quoteSchema')

const client = new Discord.Client()

mongoose.connect('mongodb://@ds249992.mlab.com:49992/quotebot-db', config.dbOptions)

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connection open')
})

client.on('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  if (message.content.match(/".*" ~.*/)) {
    const newQuote = new Quote({
      quote: message.content.match(/".*"/)[0],
      author: message.content.match(/~.*/)[0].substring(1),
    })
    newQuote.save((err) => {
      if (err)
        message.channel.send(err)
      else
        message.channel.send('SAVED -> Quote: ' + message.content.match(/".*"/)[0] + ', author: ' + message.content.match(/~.*/)[0].substring(1))
    })
  } else if (message.content.match(/!quote .*/)) {
    Quote.find({author: message.content.match(/!quote .*/)[0].substring(7)})
      .exec((err, quotes) => {
          if (err)
          message.channel.send(err)
        else {
          if (quotes.length === 0)
            message.channel.send('This author has no quotes yet!')
          else
            message.channel.send(quotes[Math.floor(Math.random() * (quotes.length))].quote)
        }
      })
  }
})

client.login(config.token)