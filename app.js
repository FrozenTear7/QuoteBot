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
  client.user.setGame('!!h to see documentation')
  setInterval(() => {
    https.get('https://discord-quote-bot-frozentear7.herokuapp.com/')
  }, 100000)
})

client.on('message', message => {
  if (message.content.match(/^'[^']+' *~.+/)) {
    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: message.content.match(/~.+/)[0].substring(1)},
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
      else if (author) {
        const newQuote = new Quote({
          quote: message.content.match(/^'[^']+'/)[0],
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
                        name: 'Quote: ' + newQuote.quote + ', author: ' + newAuthor.names[0],
                        value: 'quoteId: ' + newQuote._id + ', authorId: ' + newAuthor._id,
                        inline: true,
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
        message.channel.send({
          embed: {
            color: 3447003,
            description: err.errmsg,
          },
        }).then(msg => {
          msg.delete(15000)
        })
      else if (author)
        Quote.find({author: author._id}, (err, quotes) => {
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
            if (quotes.length === 0)
              message.channel.send({
                embed: {
                  color: 3447003,
                  description: 'This author has no quotes yet!',
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else
              message.channel.send({
                embed: {
                  color: 3447003,
                  title: 'Quote',
                  fields: [
                    {
                      name: quotes[Math.floor(Math.random() * (quotes.length))].quote + ' - ' + author.names[0],
                      value: 'quoteId: ' + quotes[Math.floor(Math.random() * (quotes.length))]._id + ', authorId: ' + author._id,
                      inline: true,
                    },
                  ],
                },
              })
          }
        })
      else
        message.channel.send({
          embed: {
            color: 3447003,
            description: 'This author does not exist!',
          },
        }).then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!authors$/) || message.content.match(/^!a$/)) {
    Author.find({server: message.channel.guild.name}, (err, authors) => {
        if (err)
          message.channel.send({
            embed: {
              color: 3447003,
              description: err.errmsg,
            },
          }).then(msg => {
            msg.delete(15000)
          })
        else if (authors.length > 0) {
          let fields = []

          authors.forEach(author => fields.push({
            name: author.names[0],
            value: 'authorId: ' + author._id,
          }))

          message.channel.send({
            embed: {
              color: 3447003,
              title: 'Authors',
              fields: fields,
            },
          }).then(msg => {
            msg.delete(60000)
          })
        } else {
          message.channel.send({
            embed: {
              color: 3447003,
              description: 'No authors available!',
            },
          }).then(msg => {
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
        message.channel.send({
          embed: {
            color: 3447003,
            description: err.errmsg,
          },
        }).then(msg => {
          msg.delete(15000)
        })
      else if (author)
        Quote.find({author: author._id}, (err, quotes) => {
            if (err)
              message.channel.send({
                embed: {
                  color: 3447003,
                  description: err.errmsg,
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else if (quotes.length > 0) {
              let fields = []

              quotes.forEach(quote => fields.push({
                name: quote.quote,
                value: 'quoteId: ' + quote._id,
              }))

              message.channel.send({
                embed: {
                  color: 3447003,
                  title: 'All author quotes',
                  fields: fields,
                },
              }).then(msg => {
                msg.delete(60000)
              })
            } else {
              message.channel.send({
                embed: {
                  color: 3447003,
                  description: 'No quotes available!',
                },
              }).then(msg => {
                msg.delete(15000)
              })
            }
          },
        )
      else
        message.channel.send({
          embed: {
            color: 3447003,
            description: 'Author does not exist!',
          },
        }).then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!alias *[^!]+ !is *.+/)) {
    Author.findOneAndUpdate(
      {names: {$in: message.content.match(/^!alias *[^!]+/)[0].substring(message.content.match(/^!alias */)[0].length, message.content.match(/^!alias *[^!]+/)[0].length - 1)}},
      {$push: {names: message.content.match(/!is *.+/)[0].substring(message.content.match(/!is */)[0].length)}},
      (err) => {
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
          message.channel.send({
            embed: {
              color: 3447003,
              description: 'New alias set!',
            },
          }).then(msg => {
            msg.delete(15000)
          })
        }
      })
  } else if (message.content.match(/^!aliases *.+/)) {
    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: message.content.match(/^!aliases *.+/)[0].substring(message.content.match(/^!aliases */)[0].length)},
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
      else if (author) {
        let description = ''

        author.names.forEach(name => description += '* ' + name + '\n')

        message.channel.send({
          embed: {
            color: 3447003,
            title: 'Aliases',
            description: description,
          },
        }).then(msg => {
          msg.delete(15000)
        })
      } else
        message.channel.send({
          embed: {
            color: 3447003,
            description: 'Author does not exist!',
          },
        }).then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!dq *.+/)) {
    Quote.deleteOne({_id: message.content.match(/^!dq *.+/)[0].substring(message.content.match(/^!dq */)[0].length)}, (err) => {
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
            description: 'Quote deleted!',
          },
        }).then(msg => {
          msg.delete(15000)
        })
    })
  } else if (message.content.match(/^!da *.+/)) {
    Quote.deleteMany({author: message.content.match(/^!da *.+/)[0].substring(message.content.match(/^!da */)[0].length)}, (err) => {
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
        Author.deleteOne({_id: message.content.match(/^!da *.+/)[0].substring(message.content.match(/^!da */)[0].length)}, (err) => {
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
                description: 'Author and quotes deleted!',
              },
            }).then(msg => {
              msg.delete(15000)
            })
        })
      }
    })
  } else if (message.content.match(/^!!h/)) {
    message.channel.send({
      embed: {
        color: 3447003,
        title: 'Bot commands:',
        fields: [
          {
            name: '\'*quote*\' ~*author*',
            value: 'Adds a quote by given author (can be any author\'s alias)',
          },
          {
            name: '!quote *author* / !q *author*',
            value: 'Returns a random quote from the author and the server the command is written from',
          },
          {name: '!authors / !a', value: 'Returns all authors, that have quotes on the server'},
          {name: '!all *author*', value: 'Returns all quotes from that author'},
          {
            name: '!alias *author* !is *new alias*',
            value: 'Add a new alias for the author (*author* can be any alias of that author)',
          },
          {name: '!aliases *author*', value: 'Returns all aliases of that author'},
          {name: '!dq *quoteId*', value: 'Deletes the quote'},
          {name: '!da *authorId*', value: 'Deletes the author and author\'s quotes'},
          {name: 'Bot\'s author', value: '[Paweł Mendroch](https://github.com/FrozenTear7), under MIT license'},
        ],
      },
    })
  }
})

client.login(process.env.BOT_TOKEN)