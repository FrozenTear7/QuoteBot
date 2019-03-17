const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')
const Quote = require('../../schemas/quote')

module.exports = class ShowAuthorQuotes extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'all',
      group: 'quotes',
      memberName: 'show_quotes',
      description: 'Shows all author\'s quotes',
      args: [
        {
          key: 'author',
          prompt: 'One of author\'s aliases',
          type: 'string',
        },
      ],
    })
  }

  run (message, {author}) {
    if (!message.channel || !message.channel.guild || !message.channel.guild.name) {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          description: 'Channel only!',
        },
      }).then(msg => {
        msg.delete(15000)
      })
    }

    message.delete(1)

    Author.findOne({
      server: message.channel.guild.name,
      names: {$in: author},
    }, (err, author) => {
      if (err)
        message.channel.send({
          embed: {
            color: 0xff0000,
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
                  color: 0xff0000,
                  description: err.errmsg,
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else if (quotes.length > 0) {
              message.channel.send({
                embed: {
                  color: 3447003,
                  title: 'All ' + author.names[0] + ' quotes',
                },
              }).then(msg => {
                msg.delete(60000)
              })

              for (let i = 0; i * 10 < quotes.length; i++) {
                let fields = []

                quotes.slice(i * 10, (i + 1) * 10 < quotes.length ? (i + 1) * 10 : quotes.length).forEach(quote => fields.push({
                  name: quote.quote,
                  value: 'quoteId: ' + quote._id,
                }))

                message.channel.send({
                  embed: {
                    color: 3447003,
                    fields: fields,
                  },
                }).then(msg => {
                  msg.delete(60000)
                })
              }
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
  }
}
