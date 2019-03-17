const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')

module.exports = class ShowAuthors extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'a',
      aliases: ['authors'],
      group: 'quotes',
      memberName: 'show_authors',
      description: 'Shows all authors',
    })
  }

  run (message, args) {
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

      Author.find({server: message.channel.guild.name}, (err, authors) => {
          if (err)
            message.channel.send({
              embed: {
                color: 0xff0000,
                description: err.errmsg,
              },
            }).then(msg => {
              msg.delete(15000)
            })
          else if (authors.length > 0) {
            message.channel.send({
              embed: {
                color: 3447003,
                title: 'Authors',
              },
            }).then(msg => {
              msg.delete(60000)
            })

            for (let i = 0; i * 10 < authors.length; i++) {
              let fields = []

              authors.slice(i * 10, (i + 1) * 10 < authors.length ? (i + 1) * 10 : authors.length).forEach(author => fields.push({
                name: author.names[0],
                value: 'authorId: ' + author._id,
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
                description: 'No authors available!',
              },
            }).then(msg => {
              msg.delete(15000)
            })
          }
        },
      )
    }
  }
}
