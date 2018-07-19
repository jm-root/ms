const cluster = require('cluster')
const log = require('jm-log4js')
const event = require('jm-event')
const MS = require('jm-ms-core')
const ms = new MS()
const logger = log.getLogger('message')

var message = function (opts = {}) {
  var app = this

  var model = {
    subscribe: async function (opts) {
      if (!opts.session) return
      var session = opts.session
      var channel = opts.data.channel
      logger.debug('subscribe, session id:%s channel:%s', session.id, channel)
      if (channel) {
        session.on(channel, function (msg) {
          session.send(msg)
        })
      }
      return {ret: true}
    },

    unsubscribe: async function (opts) {
      if (!opts.session) return
      var session = opts.session
      var channel = opts.data.channel
      logger.debug('unsubscribe, session id:%s channel:%s', session.id, channel)
      if (channel) {
        session.off(channel)
      }
      return {ret: true}
    },

    broadcast: async function (opts) {
      if (cluster.isWorker) {
        opts.type = 'message'
        process.send(opts)
        return {ret: true}
      } else {
        let doc = await this.publish(opts)
        return doc
      }
    },

    publish: async function (opts) {
      var channel = opts.data.channel
      var msg = JSON.stringify({type: 'message', data: opts.data})
      var userId = opts.data.msg.userId
      var wss = app.servers['ws']
      if (wss) {
        for (var i in wss.sessions) {
          var session = wss.sessions[i]
          if (userId) {
            if (session.userId === userId) session.emit(channel, msg)
          } else {
            session.emit(channel, msg)
          }
        }
      }
      return {ret: true}
    },

    router: function (opts) {
      var router = ms.router()
      router.add('/subscribe', 'post', model.subscribe.bind(model))
      router.add('/unsubscribe', 'post', model.unsubscribe.bind(model))
      router.add('/publish', 'post', model.publish.bind(model))
      router.add('/broadcast', 'post', model.broadcast.bind(model))
      return router
    }

  }
  event.enableEvent(model)

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

module.exports = message
