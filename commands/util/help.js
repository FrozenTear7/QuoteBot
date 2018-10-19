const Commando = require('discord.js-commando')

module.exports = class Help extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'h',
      group: 'util',
      memberName: 'documentation',
      description: 'Shows bot\'s documentation',
    })
  }

  run(message, args) {
    message.delete(1)
    return message.channel.send({
      embed: {
        color: 0xfbbdf4,
        title: 'Bot commands:',
        fields: [
          {
            name: '\'*quote*\' ~*author*',
            value: 'Adds a quote by given author (can be any author\'s alias)',
          },
          {
            name: '&quote *author* / &q *author*',
            value: 'Returns a random quote from the author and the server the command is written from',
          },
          {name: '&authors / &a', value: 'Returns all authors, that have quotes on the server'},
          {name: '&all *author*', value: 'Returns all quotes from that author'},
          {
            name: '&alias *author* &is *new alias*',
            value: 'Add a new alias for the author (*author* can be any alias of that author)',
          },
          {name: '&aliases *author*', value: 'Returns all aliases of that author'},
          {name: '&dq *quoteId*', value: 'Deletes the quote'},
          {name: '&da *authorId*', value: 'Deletes the author and author\'s quotes'},
          {name: '&dl *alias*', value: 'Deletes author\'s alias'},
          {name: 'Bot\'s author', value: '[Paweł Mendroch](https://github.com/FrozenTear7), under MIT license'},
        ],
      },
    })
  }
}
