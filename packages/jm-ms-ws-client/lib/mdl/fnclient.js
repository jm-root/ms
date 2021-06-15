const log = require('jm-logger')
const { utils } = require('jm-ms-core')
const error = require('jm-err')
const { WebSocket: WS } = require('jm-net')
const Session = require('jm-ms-session')

class ClientSession extends Session {
  request (opts) {
    opts = utils.preRequest.apply(this, arguments)
    opts.uri = this.prefix + (opts.uri || '')
    return super.request(opts)
  }

  notify (opts) {
    opts = utils.preRequest.apply(this, arguments)
    opts.uri = this.prefix + (opts.uri || '')
    return super.notify(opts)
  }

  onRequest (opts) {
    opts.session = this
    opts.ips && opts.ips.length && (opts.ip = opts.ips[0])
    opts.protocol = 'ws'
    return super.onRequest(opts)
  }

  toJSON () {
    const { prefix, uri, timeout, debug } = this
    return { prefix, uri, timeout, debug }
  }
}

module.exports = function (_Adapter) {
  return function (opts = {}) {
    if (typeof opts === 'string') {
      opts = { uri: opts }
    }

    const { uri, timeout, logger = log.logger, debug } = opts
    let { prefix = '' } = opts

    if (!uri) throw error.err(error.Err.FA_PARAMS)

    const path = utils.getUriPath(uri)
    prefix = path + prefix

    const ws = new WS(Object.assign({ Adapter: _Adapter }, opts))
    ws.connect(uri)

    const session = new ClientSession({
      debug,
      logger,
      timeout
    })

    Object.assign(session, {
      uri,
      prefix,

      send: function () {
        ws.send.apply(ws, arguments)
      },

      close: function () {
        ws.close.apply(ws, arguments)
      }
    })

    ws
      .on('message', message => {
        session.emit('message', message)
      })
      .on('open', () => {
        session.emit('open')
        logger.info('ws.opened', uri)
      })
      .on('error', e => {
        session.emit('error', e)
        logger.error('ws.error', uri)
        logger.error(e)
      })
      .on('close', event => {
        session.reset()
        session.emit('close', event)
        logger.info('ws.closed', uri)
      })
      .on('heartBeat', () => {
        if (session.emit('heartBeat')) return true
        session.notify('/', 'get')
        return true
      })
      .on('heartDead', () => {
        logger.info('ws.heartDead', uri)
        return session.emit('heartDead')
      })
      .on('connect', () => {
        session.emit('connect')
        logger.info('ws.connect', uri)
      })
      .on('reconnect', () => {
        session.emit('reconnect')
        logger.info('ws.reconnect', uri)
      })
      .on('connectFail', () => {
        session.emit('connectFail')
        logger.info('ws.connectFail', uri)
      })

    return session
  }
}
