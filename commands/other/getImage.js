const Commando = require('discord.js-commando')
const Danbooru = require('danbooru')

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

    const booru = new Danbooru()

    booru.posts({ tags: 'order:rank' }).then(posts => {
      const index = Math.floor(Math.random() * posts.length)
      const post = posts[index]

      return message.channel.send({
        embed: {
          color: 3447003,
          image: {
            'url': post.file_url
          },
        },
      })

    })
  }
}
