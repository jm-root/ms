const error = require('jm-err')
const event = require('jm-event')
const log = require('jm-log4js')
const wrapper = require('jm-ms-wrapper')
const MS = require('jm-ms')
const ms = new MS()
const logger = log.getLogger('example')

let $ = {
  router () {
    const router = ms.router()
    wrapper()(router)
    router
      .use(opts => {
        opts.time = Date.now()
      })
      .add('/', opts => {
        return opts
      })
      .add('/err', opts => {
        throw error.err(error.Err.FAIL)
      })
    return router
  }
}

event.enableEvent($)

module.exports = function (opts) {
  // websocket 例子
  const app = this
  if (app) {
    app
      .on('connection', function (session) {
        logger.debug(`ws client connected: ${session.id}`)
        session.on('close', () => { logger.debug(`ws client disconnected: ${session.id}`) })
        $.emit('connection', session)
        $.message.publish({
          channel: 'test',
          msg: { abc: 123, userId: '1222' }
        })
      })
      .on('open', function () {
        $.message = app.modules.message
      })
  }

  return $
}
