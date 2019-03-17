const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')
const Quote = require('../../schemas/quote')

module.exports = class ShowQuote extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'q',
      aliases: ['quote'],
      group: 'quotes',
      memberName: 'show_quote',
      description: 'Shows random quote from the author',
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

      message.delete(1)

      Author.findOne({
        server: message.channel.guild.name,
        names: {$in: author},
      }, (err, author) => {
        if (err)
          return message.channel.send({
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
              return message.channel.send({
                embed: {
                  color: 0xff0000,
                  description: err.errmsg,
                },
              }).then(msg => {
                msg.delete(15000)
              })
            else {
              if (quotes.length === 0)
                return message.channel.send({
                  embed: {
                    color: 3447003,
                    description: author.names[0] + ' has no quotes yet!',
                  },
                }).then(msg => {
                  msg.delete(15000)
                })
              else
                return message.channel.send({
                  embed: {
                    color: 3447003,
                    title: quotes[Math.floor(Math.random() * (quotes.length))].quote + ' - ' + author.names[0],
                  },
                })
            }
          })
        else
          return message.channel.send({
            embed: {
              color: 3447003,
              description: 'This author does not exist!',
            },
          }).then(msg => {
            msg.delete(15000)
          })
      })
    }
  }
}