const cluster = require('cluster')
const log = require('jm-log4js')
const event = require('jm-event')
const MS = require('jm-ms-core')
const ms = new MS()
const logger = log.getLogger('message')

module.exports = function (opts = {}) {
  const app = this

  const model = {
    subscribe: function (opts) {
      if (!opts.session) return
      let session = opts.session
      let channel = opts.data.channel
      logger.debug('subscribe, session id:%s channel:%s', session.id, channel)
      if (channel) {
        session.on(channel, function (msg) {
          session.send(msg)
        })
      }
      return { ret: true }
    },

    unsubscribe: function (opts) {
      if (!opts.session) return
      let session = opts.session
      let channel = opts.data.channel
      logger.debug('unsubscribe, session id:%s channel:%s', session.id, channel)
      if (channel) {
        session.off(channel)
      }
      return { ret: true }
    },

    broadcast: function (opts) {
      if (cluster.isWorker) {
        opts.type = 'message'
        process.send(opts)
        return { ret: true }
      } else {
        let doc = this.publish(opts)
        return doc
      }
    },

    publish: function (opts) {
      let channel = opts.data.channel
      let msg = JSON.stringify({ type: 'message', data: opts.data })
      let userId = opts.data.msg.userId
      let wss = app.servers['ws']
      if (wss) {
        for (let i in wss.sessions) {
          let session = wss.sessions[i]
          if (userId) {
            if (session.userId === userId) session.emit(channel, msg)
          } else {
            session.emit(channel, msg)
          }
        }
      }
      return { ret: true }
    },

    router: function (opts) {
      const router = ms.router()
      router
        .add('/subscribe', 'post', model.subscribe.bind(model))
        .add('/unsubscribe', 'post', model.unsubscribe.bind(model))
        .add('/publish', 'post', model.publish.bind(model))
        .add('/broadcast', 'post', model.broadcast.bind(model))
      return router
    }

  }
  event.enableEvent(model, { async: true })

  if (cluster.isWorker) {
    process.on('message', function (msg) {
      if (typeof msg === 'object') {
        if (msg.type === 'message') {
          model.publish(msg)
        }
      }
    })
  }

  return model
}
