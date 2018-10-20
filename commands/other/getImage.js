const Commando = require('discord.js-commando')
const Author = require('../../schemas/author')
const Quote = require('../../schemas/quote')

module.exports = class GetImage extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'i',
      aliases: ['image'],
      group: 'other',
      memberName: 'get_image',
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

  run(message, {author}) {
    message.delete(1)

    fetch('https://danbooru.donmai.us/posts/1.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic RnJvemVuVGVhcjc6bTdNUGdabWQ1WnpFeFhRbmJvWlZpTU5Y',
      },
      body: {'post': {'rating': 's', 'tag_string': 'kousaka_tamaki'}},
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Could not fetch the image')
        }
      })
      .then(data => {
        return message.channel.send({
          embed: {
            color: 3447003,
            image: {
              "url": data.file_url,
            }
          },
        })
      })
      .catch(error => {
        return message.channel.send({
          embed: {
            color: 0xff0000,
            description: error,
          },
        }).then(msg => {
          msg.delete(15000)
        })
      })
  }
}
