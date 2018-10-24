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

    if(!message.channel.nsfw)
      if(!message.channel.nsfw)
        return message.channel.send({
          embed: {
            color: 0xff0000,
            description: 'Channel needs to be NSFW',
          },
        }).then(msg => {
          msg.delete(15000)
        })

    const booru = new Danbooru()

    booru.posts({ random: true, limit: 5, tags: 'sex'}).then(posts => {
      posts.forEach(post => {
        message.channel.send({
          embed: {
            image: {
              'url': post.file_url
            },
          },
        })
      })
    }).catch(err => {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          description: err,
        },
      }).then(msg => {
        msg.delete(15000)
      })
    })
  }
}
