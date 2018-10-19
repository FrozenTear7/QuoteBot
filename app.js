const Discord = require('discord.js')
const mongoose = require('mongoose')
// const config = require('./config.json')
const Quote = require('./schemas/quote')
const Author = require('./schemas/author')
const express = require('express')
const https = require('https')
const Commando = require('discord.js-commando')
const path = require('path')

const app = express()

const client = new Commando.Client({
  owner: '249135924762378241',
  commandPrefix: '&'
})

app.listen(process.env.PORT || 8080)

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
  client.user.setActivity('&h to see documentation')
  setInterval(() => {
    https.get('https://discord-quote-bot-frozentear7.herokuapp.com/')
  }, 100000)
})

client.on('message', message => {
    if (message.content.match(/^['"][^']+['"] *~.+/)) {
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
            quote: message.content.match(/^['"][^']+['"]/)[0],
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
    }
  },
)

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on('disconnect', () => {
    console.warn('Disconnected!')
  })
  .on('reconnecting', () => {
    console.warn('Reconnecting...')
  })
  .on('commandError', (cmd, err) => {
    if (err instanceof Commando.FriendlyError) return
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`)
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
  })

client.registry
  .registerGroup('util', 'Util')
  .registerGroup('quotes', 'Quotes')
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(process.env.BOT_TOKEN)
