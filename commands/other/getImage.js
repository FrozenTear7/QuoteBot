const Commando = require('discord.js-commando')
const https = require('https')
const axios = require('axios')

module.exports = class GetImage extends Commando.Command {
  constructor (client) {
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

  run (message, {tag}) {
    message.delete(1)

    axios.put('https://danbooru.donmai.us/posts/1.json', {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic RnJvemVuVGVhcjc6bTdNUGdabWQ1WnpFeFhRbmJvWlZpTU5Y',
      },
    })
      .then((response) => {
        return message.channel.send({
          embed: {
            color: 3447003,
            image: {
              'url': JSON.parse(response.data).file_url,
            },
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
