const mongoose = require('mongoose')
// const config = require('./config.json')
const Quote = require('./schemas/quote')
const Author = require('./schemas/author')
const express = require('express')
const https = require('https')
const Commando = require('discord.js-commando')
const path = require('path')

const app = express()

app.listen(process.env.PORT || 8080)

mongoose.connect('mongodb://@ds249992.mlab.com:49992/quotebot-db', {
  'user': process.env.DBUSER,
  'pass': process.env.DBPASS,
  'useNewUrlParser': true,
})

// mongoose.connect('mongodb://@ds249992.mlab.com:49992/quotebot-db', config.dbOptions)

let db = mongoose.connection
db.on('error', console.log)
db.once('open', () => {
  console.log('Connection open')
})

const client = new Commando.Client({
  owner: '249135924762378241',
  commandPrefix: '&',
  unknownCommandResponse: false,
})

client.on('ready', () => {
  console.log('Ready!')
  client.user.setUsername('VerySmug')
  client.user.setActivity('&h to see documentation')
  setInterval(() => {
    https.get('https://discord-very-smug-bot.herokuapp.com//')
  }, 100000)
})

client.on('error', console.log)

client.on('message', message => {
    if (message.channel.type === 'dm') {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          description: 'Channel only!',
        },
      }).then(msg => {
        msg.delete(15000)
      })
    } else {
      if (!message.author.bot && message.content.match(/^['"].+['"] *~ *.+/)) {
        if (message.content.length >= 256) {
          message.channel.send({
            embed: {
              color: 3447003,
              description: 'Message must be shorter than 256 characters!',
            },
          }).then(msg => {
            msg.delete(15000)
          })
        } else {
          Author.findOne({
            server: message.channel.guild.name,
            names: {$in: message.content.match(/~ *.+/)[0].substring(message.content.match(/~ */)[0].length)},
          }, (err, author) => {
            if (err)
              message.channel.send({
                embed: {
                  color: 3447003,
                  description: err.errmsg,
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else if (!message.content.match(/^['"].+['"]/))
              message.channel.send({
                embed: {
                  color: 3447003,
                  description: 'Something went wrong',
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else if (author) {
              const newQuote = new Quote({
                quote: message.content.match(/^['"].+['"]/)[0],
                author: author,
              })

              newQuote.save((err) => {
                if (err)
                  message.channel.send({
                    embed: {
                      color: 3447003,
                      description: err.errmsg,
                    },
                  }).then(msg => {
                    msg.delete(15000)
                  })
                else
                  message.channel.send({
                    embed: {
                      color: 3447003,
                      title: 'Saved',
                      fields: [
                        {
                          name: 'Quote: ' + newQuote.quote + ', author: ' + author.names[0],
                          value: 'quoteId: ' + newQuote._id + ', authorId: ' + author._id,
                        },
                      ],
                    },
                  }).then(msg => {
                    msg.delete(15000)
                  })
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
                  message.channel.send({
                    embed: {
                      color: 3447003,
                      description: err.errmsg,
                    },
                  }).then(msg => {
                    msg.delete(15000)
                  })
                else {
                  const newQuote = new Quote({
                    quote: message.content.match(/^'[^']+'/)[0],
                    author: newAuthor,
                  })

                  newQuote.save((err) => {
                    if (err)
                      message.channel.send({
                        embed: {
                          color: 3447003,
                          description: err.errmsg,
                        },
                      }).then(msg => {
                        msg.delete(15000)
                      })
                    else
                      message.channel.send({
                        embed: {
                          color: 3447003,
                          title: 'Saved',
                          fields: [
                            {
                              name: 'Quote added!',
                              value: 'quoteId: ' + newQuote._id + ', authorId: ' + newAuthor._id,
                            },
                          ],
                        },
                      }).then(msg => {
                        msg.delete(15000)
                      })
                  })
                }
              })
            }
          })
        }
      }
    }
  },
)

client.registry
  .registerGroup('util', 'Util')
  .registerGroup('quotes', 'Quotes')
  .registerGroup('other', 'Other')
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(process.env.BOT_TOKEN)
// client.login(config.BOT_TOKEN)
