const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')

module.exports = class DeleteAuthor extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'dl',
      group: 'quotes',
      memberName: 'delete_alias',
      description: 'Delete an alias',
      args: [
        {
          key: 'alias',
          prompt: 'Author\'s alias',
          type: 'string',
        },
      ],
    })
  }

  run (message, {alias}) {
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
        names: {$in: alias},
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
        else if (author) {
          if (author.names.length === 1)
            message.channel.send({
              embed: {
                color: 3447003,
                description: 'Author needs at least one alias!',
              },
            }).then(msg => {
              msg.delete(15000)
            })
          else {
            Author.findOneAndUpdate(
              {
                server: message.channel.guild.name,
                names: {$in: alias},
              },
              {$pull: {names: alias}},
              (err) => {
                if (err)
                  message.channel.send({
                    embed: {
                      color: 0xff0000,
                      description: err.errmsg,
                    },
                  }).then(msg => {
                    msg.delete(15000)
                  })
                else {
                  message.channel.send({
                    embed: {
                      color: 3447003,
                      description: 'Alias deleted!',
                    },
                  }).then(msg => {
                    msg.delete(15000)
                  })
                }
              })
          }
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
    }
  }
}
