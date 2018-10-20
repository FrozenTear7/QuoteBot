const Commando = require('discord.js-commando')
const https = require('https')

module.exports = class GetImage extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'i',
      aliases: ['image'],
      group: 'other',
      memberName: 'get_image',
      description: 'Shows a random image with a provided tag from danbooru',
      args: [
        {
          key: 'tag',
          prompt: 'Image\'s tag to get',
          type: 'string',
        },
      ],
    })
  }

  run(message, {author}) {
    message.delete(1)

    const https = require('https')
    https.request({
      host: 'https://danbooru.donmai.us/posts/1.json',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic RnJvemVuVGVhcjc6bTdNUGdabWQ1WnpFeFhRbmJvWlZpTU5Y',
      },
      body: {'post': {'rating': 's', 'tag_string': 'kousaka_tamaki'}},
    }, (res => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        return message.channel.send({
          embed: {
            color: 3447003,
            image: {
              'url': JSON.parse(data).file_url,
            },
          },
        })
      }).on('error', (err) => {
        return message.channel.send({
          embed: {
            color: 0xff0000,
            description: err,
          },
        }).then(msg => {
          msg.delete(15000)
        })
      })
    }))
  }
}
