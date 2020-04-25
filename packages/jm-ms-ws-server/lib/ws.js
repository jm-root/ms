const WebSocket = require('ws')
const proxyaddr = require('proxy-addr')
const event = require('jm-event')
const { EventEmitter } = require('jm-event')
const error = require('jm-err')
const log = require('jm-log4js')

const logger = log.getLogger('ms-ws-server')
const Err = error.Err
const defaultPort = 80

const defineGetter = function (obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  })
}

const trust = function () {
  return true
}

class Session extends EventEmitter {
  constructor () {
    super({ async: true })
  }
}

module.exports = function (router, opts = { port: defaultPort }) {
  const { config: { debug } = {} } = router
  debug && (logger.setLevel('debug'))

  let id = 0
  let sessions = {}

  const doc = {
    sessions,
    broadcast: function (data) {
      let sessions = this.sessions
      for (let i in sessions) {
        sessions[i].send(data, err => {}) // eslint-disable-line
      }
    }
  }
  event.enableEvent(doc, { async: true })

  const wss = new WebSocket.Server(opts)
  wss.on('connection', function (ws, req) {
    const { headers, url: uri } = req
    const { config = {} } = router
    const { debug = false } = config

    const session = new Session()
    Object.assign(session, {
      id: id++,
      headers,
      uri,
      send: function () {
        ws.send.apply(ws, arguments)
      },
      close: function () {
        ws.close.apply(ws, arguments)
      }
    })

    logger.info(`session ${session.id} connected.`, { uri, headers })

    defineGetter(req, 'ip', function () {
      return proxyaddr(this, trust)
    })

    defineGetter(req, 'ips', function () {
      let addrs = proxyaddr.all(this, trust)
      return addrs.slice(1).reverse()
    })

    session.ip = req.ip
    session.ips = req.ips

    sessions[session.id] = session
    doc.emit('connection', session)
    ws.on('message', function (message) {
      doc.emit('message', message, session)
      session.emit('message', message)
      let json = null
      try {
        json = JSON.parse(message)
      } catch (err) {
        return
      }
      json.session = session
      json.ip || (json.ip = session.ip)
      json.ips || (json.ips = session.ips)
      json.ips && json.ips.length && (json.ip = json.ips[0])
      json.protocol = 'ws'
      let p = router.request(json)
      if (json.id) {
        p
          .then(doc => {
            if (debug) {
              logger.debug(`ok. request:\n${JSON.stringify(json, null, 2)}\nresponse:\n${JSON.stringify(doc, null, 2)}`)
            }
            doc = {
              id: json.id,
              data: doc || {}
            }
            ws.send(JSON.stringify(doc))
          })
          .catch(e => {
            if (debug) {
              logger.debug(`fail. request:\n${JSON.stringify(json, null, 2)}\nresponse:\n${JSON.stringify(e.data, null, 2)}`)
            }
            logger.error(e)
            let doc = e.data
            doc || (doc = Object.assign({ status: e.status || error.Err.FA_INTERNALERROR.err }, Err.FA_INTERNALERROR, { msg: e.message }))
            doc = {
              id: json.id,
              data: doc
            }
            ws.send(JSON.stringify(doc))
          })
      }
    })
    ws.onclose = function (event) {
      logger.info(`session ${session.id} disconnected.`)
      delete sessions[session.id]
      doc.emit('close', session)
      session.emit('close')
    }
  })

  return doc
}
