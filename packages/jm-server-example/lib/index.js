const error = require('jm-err')
const event = require('jm-event')
const wrapper = require('jm-ms-wrapper')
const MS = require('jm-ms')
const ms = new MS()

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
        session.on('close', () => {
          // do something on disconnected.
        })
        $.emit('connection', session)
        setTimeout(() => {
          // delay 1000 ms
          $.message.publish({
            data: {
              channel: 'test',
              msg: { abc: 123 }
            }
          })
        }, 1000)
      })
      .on('open', function () {
        $.message = app.modules.message
      })
  }

  return $
}
