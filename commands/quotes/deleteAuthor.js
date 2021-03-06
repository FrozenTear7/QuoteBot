const mongoose = require('mongoose')
const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')
const Quote = require('../../schemas/quote')

module.exports = class DeleteAuthor extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'da',
      group: 'quotes',
      memberName: 'delete_author',
      description: 'Delete a quote',
      args: [
        {
          key: 'authorId',
          prompt: 'AuthorId',
          type: 'string',
        },
      ],
    })
  }

  run (message, {authorId}) {
    message.delete(1)

    if (authorId.match(/^[0-9a-fA-F]{24}$/)) {
      Quote.deleteMany({author: authorId}, (err) => {
        if (err) {
          message.channel.send({
            embed: {
              color: 0xff0000,
              description: err.errmsg,
            },
          }).then(msg => {
            msg.delete(15000)
          })
        } else {
          Author.deleteOne({
            server: message.channel.guild.name,
            _id: authorId,
          }, (err) => {
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
                  description: 'Author and quotes deleted!',
                },
              }).then(msg => {
                msg.delete(15000)
              })
          })
        }
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
