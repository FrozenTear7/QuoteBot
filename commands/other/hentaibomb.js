const Commando = require('discord.js-commando')
const Danbooru = require('danbooru')

module.exports = class GetImage extends Commando.Command {
  constructor (client) {
    super(client, {
      name: 'hentaibomb',
      group: 'other',
      memberName: 'hentaibomb',
      description: 'Showers you with nsfw images from danbooru',
    })
  }

  run (message, {tag}) {
    message.delete(1)

    const booru = new Danbooru()

    booru.posts({ random: true, limit: 5, tags: 'sex'}).then(posts => {
      posts.forEach(post => {
        message.channel.send({
          embed: {
            color: 3447003,
            title: 'Hentai UwU :3',
            image: {
              'url': post.file_url
            },
          },
        })
      })
    })
  }
}
