const timers = {
  fastTimer: 15000,
  longTimer: 60000,
}

const replyError = (message, err) => {
  message.channel.send(err.errmsg).then(msg => {
    msg.delete(timers.fastTimer)
  })
}

module.exports = {
  replyError: replyError(),
}