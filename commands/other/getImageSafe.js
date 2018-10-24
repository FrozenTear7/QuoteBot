const Commando = require('discord.js-commando')
const Danbooru = require('danbooru')

module.exports = class GetImage extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'isafe',
      group: 'other',
      memberName: 'get_image_safe',
      description: 'Shows a random SFW image with a provided tag from danbooru',
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

    const booru = new Danbooru()

    booru.posts({ random: true, limit: 1, tags: 'rating:safe ' + tag}).then(posts => {
      return message.channel.send({
        embed: {
          color: 3447003,
          title: 'Safe for work UwU :3',
          image: {
            'url': posts[0].file_url
          },
        },
      })

    })
  }
}
