const Discord = require('discord.js')
const config = require('./config.json')

const client = new Discord.Client()

client.on('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  if (message.content.match(/".*" ~.*/)) {
    message.channel.send('Quote: ' + message.content.match(/".*"/)[0] + ', author: ' + message.content.match(/~.*/)[0].substring(1))
  }
})

client.login(config.token)