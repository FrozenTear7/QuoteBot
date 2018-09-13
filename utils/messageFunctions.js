const timers = {
  fastTimer: 15000,
  longTimer: 60000,
}

const replyError = (message, err) => {
  message.channel.send(err.errmsg).then(msg => {
    msg.delete(timers.fastTimer)
  })
}

const replyInfo = (message, text) => {
  message.channel.send(text).then(msg => {
    msg.delete(timers.fastTimer)
  })
}

const replyData = (message, data) => {
  message.channel.send(data).then(msg => {
    msg.delete(timers.longTimer)
  })
}

module.exports = {
  replyError: replyError(),
  replyInfo: replyInfo(),
  replyData: replyData(),
}