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

    if (!message.channel.nsfw)
      return message.channel.send({
        embed: {
          color: 0xff0000,
          description: 'Channel needs to be NSFW',
        },
      }).then(msg => {
        msg.delete(15000)
      })

    const booru = new Danbooru()

    booru.posts({random: true, limit: 1, tags: tag}).then(posts => {
      if (posts && posts[0] && posts[0].file_url)
        return message.channel.send({
          embed: {
            color: 3447003,
            title: message.author.tag + ' requested: ' + tag,
            image: {
              'url': posts[0].file_url,
            },
          },
        })
      else
        return message.channel.send({
          embed: {
            color: 0xff0000,
            title: 'Could not get an image (might be a wrong tag)',
          },
        }).then(msg => {
          msg.delete(15000)
        })
    }).catch(err => {
      console.log(err)

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
