const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')

module.exports = class AddAlias extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'alias',
      group: 'quotes',
      memberName: 'add_alias',
      description: 'Add a new author\'s alias',
      args: [
        {
          key: 'alias',
          prompt: 'One of author\'s aliases',
          type: 'string',
        },
      ],
    })
  }

  run(message, args) {
    if(!message.channel || !message.channel.guild || !message.channel.guild.name) {
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

    const aliases = args.alias.replace(', ', ',').replace(' ,', ',').split(',')
    const newAuthor = aliases[0]
    const newAlias = aliases[1]

    if (aliases.length === 2) {
      Author.findOne({
        server: message.channel.guild.name,
        names: {$in: newAlias},
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
          message.channel.send({
            embed: {
              color: 3447003,
              description: 'Alias already in use!',
            },
          }).then(msg => {
            msg.delete(15000)
          })
        else
          Author.findOneAndUpdate(
            {
              server: message.channel.guild.name,
              names: {$in: newAuthor},
            },
            {$push: {names: newAlias}},
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
                    description: 'New alias set!',
                  },
                }).then(msg => {
                  msg.delete(15000)
                })
              }
            })
      })
    } else {
      message.channel.send({
        embed: {
          color: 0xff0000,
          description: 'Wrong number of arguments',
        },
      }).then(msg => {
        msg.delete(15000)
      })
    }
  }
}
