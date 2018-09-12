const Discord = require('discord.js')
const mongoose = require('mongoose')
// const config = require('./config.json')
const Quote = require('./schemas/quote')
const Author = require('./schemas/author')
const express = require('express')
const https = require('https')

const app = express()

app.listen(process.env.PORT || 8080)

const client = new Discord.Client()

mongoose.connect('mongodb://@ds249992.mlab.com:49992/quotebot-db', {
  'user': process.env.DBUSER,
  'pass': process.env.DBPASS,
  'useNewUrlParser': true,
})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connection open')
})

client.on('ready', () => {
  console.log('Ready!')
  setInterval(() => {
    https.get('https://discord-quote-bot-frozentear7.herokuapp.com/')
  }, 100000)
})

client.on('message', message => {
  if (message.content.match(/^"[^"]+" *~.+/)) {
    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: message.content.match(/~.+/)[0].substring(1)},
    }, (err, author) => {
      if (err)
        message.channel.send(err).then(msg => {
          msg.delete(15000)
        })
      else if (author) {
        const newQuote = new Quote({
          quote: message.content.match(/^"[^"]+"/)[0],
          author: author,
        })

        newQuote.save((err) => {
          if (err)
            message.channel.send(err).then(msg => {
              msg.delete(15000)
            })
          else {
            console.log(newQuote.quote)
            console.log(author.names[0])
            message.channel.send('SAVED -> Quote: ' + newQuote.quote + ', author: ' + author.names[0]).then(msg => {
              msg.delete(15000)
            })
          }
        })
      } else {
        let authorNames = []
        authorNames.push(message.content.match(/~.+/)[0].substring(1))

        const newAuthor = new Author({
          names: authorNames,
          server: message.channel.guild.name,
        })

        newAuthor.save((err) => {
          if (err)
            message.channel.send(err).then(msg => {
              msg.delete(15000)
            })
          else {
            const newQuote = new Quote({
              quote: message.content.match(/^"[^"]+"/)[0],
              author: newAuthor,
            })

            newQuote.save((err) => {
              if (err)
                message.channel.send(err).then(msg => {
                  msg.delete(15000)
                })
              else
                message.channel.send('SAVED -> Quote: ' + newQuote.quote + ', author: ' + newAuthor.names[0]).then(msg => {
                  msg.delete(15000)
                })
            })
          }

        })
      }
    })
  } else if (message.content.match(/^!quote *.+/) || message.content.match(/^!q *.+/)) {
    let author

    if (message.content.match(/^!quote *.+/))
      author = message.content.match(/^!quote *.+/)[0].substring(message.content.match(/^!quote */)[0].length)
    else if (message.content.match(/^!q *.+/))
      author = message.content.match(/^!q *.+/)[0].substring(message.content.match(/^!q */)[0].length)

    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: author},
    }, (err, author) => {
      if (err)
        message.channel.send(err).then(msg => {
          msg.delete(15000)
        })
      else if (author)
        Quote.find({author: author._id}, (err, quotes) => {
          if (err)
            message.channel.send(err).then(msg => {
              msg.delete(15000)
            })
          else {
            if (quotes.length === 0)
              message.channel.send('This author has no quotes yet!').then(msg => {
                msg.delete(15000)
              })
            else
              message.channel.send(quotes[Math.floor(Math.random() * (quotes.length))].quote + ' - ' + author.names[0])
          }
        })
      else
        message.channel.send('Author does not exist!').then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!authors$/) || message.content.match(/^!a$/)) {
    Author.find({server: message.channel.guild.name}, (err, authors) => {
        if (err)
          message.channel.send(err).then(msg => {
            msg.delete(15000)
          })
        else if (authors.length > 0) {
          message.channel.send(authors.map(author => author.names[0])).then(msg => {
            msg.delete(60000)
          })
        } else {
          message.channel.send('No authors available!').then(msg => {
            msg.delete(15000)
          })
        }
      },
    )
  } else if (message.content.match(/^!all *.+/)) {
    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: message.content.match(/^!all *.+/)[0].substring(message.content.match(/^!all */)[0].length)},
    }, (err, author) => {
      if (err)
        message.channel.send(err).then(msg => {
          msg.delete(15000)
        })
      else if (author)
        Quote.find({author: author._id}, (err, quotes) => {
            if (err)
              message.channel.send(err).then(msg => {
                msg.delete(15000)
              })
            else if (quotes.length > 0) {
              message.channel.send(quotes.map(quote => quote.quote)).then(msg => {
                msg.delete(60000)
              })
            } else {
              message.channel.send('No quotes available!').then(msg => {
                msg.delete(15000)
              })
            }
          },
        )
      else
        message.channel.send('Author does not exist!').then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!alias *[^!]+ !is *.+/)) {
    Author.findOneAndUpdate(
      {names: {$in: message.content.match(/^!alias *[^!]+/)[0].substring(message.content.match(/^!alias */)[0].length, message.content.match(/^!alias *[^!]+/)[0].length - 1)}},
      {$push: {names: message.content.match(/!is *.+/)[0].substring(message.content.match(/!is */)[0].length)}},
      (err) => {
        if (err)
          message.channel.send(err).then(msg => {
            msg.delete(15000)
          })
        else {
          message.channel.send('New alias set!').then(msg => {
            msg.delete(15000)
          })
        }
      })
  }
})

client.login(process.env.BOT_TOKEN)