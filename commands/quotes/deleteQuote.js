const mongoose = require('mongoose')
const Commando = require('discord.js-commando')
const Quote = require('../../schemas/quote')

module.exports = class DeleteQuote extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'dq',
      group: 'quotes',
      memberName: 'delete_quote',
      description: 'Delete a quote',
      args: [
        {
          key: 'quoteId',
          prompt: 'QuoteId',
          type: 'string',
        },
      ],
    })
  }

  run (message, {quoteId}) {
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

      if (quoteId.match(/^[0-9a-fA-F]{24}$/)) {
        Quote.deleteOne({_id: quoteId}, (err) => {
          if (err)
            message.channel.send({
              embed: {
                color: 0xff0000,
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
      } else {
        message.channel.send({
          embed: {
            color: 0xff0000,
            description: 'Wrong id',
          },
        }).then(msg => {
          msg.delete(15000)
        })
      }
    }
  }
}