const Discord = require('discord.js')
const mongoose = require('mongoose')
// const config = require('./config.json')
const Quote = require('./quoteSchema')
const express = require('express')

const app = express()

function stayAlive (counter) {
  if (counter < 10) {
    setTimeout(() => {
      counter++
      console.log('Still kickin: ' + counter)
      stayAlive(counter)
    }, 100000)
  }
}

app.listen(process.env.PORT || 8080)

const client = new Discord.Client()

mongoose.connect('mongodb://@ds249992.mlab.com:49992/quotebot-db', {
  'user': process.env.DBUSER,
  'pass': process.env.DBPASS,
  'useNewUrlParser': true,
})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connection open')
})

client.on('ready', () => {
  console.log('Ready!')
  stayAlive(0)
})

client.on('message', message => {
  if (message.content.match(/".*" ~.*/)) {
    const newQuote = new Quote({
      quote: message.content.match(/".*"/)[0],
      author: message.content.match(/~.*/)[0].substring(1),
      server: message.channel.guild.name,
    })
    newQuote.save((err) => {
      if (err)
        message.channel.send(err)
      else
        message.channel.send('SAVED -> Quote: ' + message.content.match(/".*"/)[0] + ', author: ' + message.content.match(/~.*/)[0].substring(1)).then(msg => {
          msg.delete(3000)
        })
    })
  } else if (message.content.match(/!quote .*/) || message.content.match(/!q .*/)) {
    let author

    if(message.content.match(/!quote .*/))
      author = message.content.match(/!quote .*/)[0].substring(7)
    else if (message.content.match(/!q .*/))
      author = message.content.match(/!q .*/)[0].substring(3)

    if(author)
      Quote.find({server: message.channel.guild.name, author: author})
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
    else
      message.channel.send('Wrong author')
  }
})

client.login(process.env.BOT_TOKEN)