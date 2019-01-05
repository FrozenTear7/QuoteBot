const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')

module.exports = class ShowAuthorAliases extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      group: 'quotes',
      memberName: 'show_aliases',
      description: 'Shows all author\'s aliases',
      args: [
        {
          key: 'author',
          prompt: 'One of author\'s aliases',
          type: 'string',
        },
      ],
    })
  }

  run(message, {author}) {
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
      else if (author) {
        let description = ''

        author.names.forEach(name => description += '* ' + name + '\n')

        message.channel.send({
          embed: {
            color: 3447003,
            title: author.names[0] + ' aliases',
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
  }
}
