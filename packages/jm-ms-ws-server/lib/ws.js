const WebSocket = require('ws')
const proxyaddr = require('proxy-addr')
const event = require('jm-event')
const error = require('jm-err')

const Err = error.Err
const defaultPort = 80

let server = async function (router, opts = {port: defaultPort}) {
  let id = 0
  let sessions = {}

  let doc = {
    sessions,
    broadcast: function (data) {
      let sessions = this.sessions
      for (let i in sessions) {
        sessions[i].send(data, err => {})
      }
    }
  }
  event.enableEvent(doc)

  let defineGetter = function (obj, name, getter) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: true,
      get: getter
    })
  }

  let trust = function () {
    return true
  }

  let wss = new WebSocket.Server(opts)
  wss.on('connection', function (ws) {
    let session = {
      id: id++,
      send: function () {
        ws.send.apply(ws, arguments)
      },
      close: function () {
        ws.close.apply(ws, arguments)
      }
    }

    if (ws.upgradeReq) {
      let req = ws.upgradeReq

      defineGetter(req, 'ip', function () {
        return proxyaddr(this, trust)
      })

      defineGetter(req, 'ips', function () {
        let addrs = proxyaddr.all(this, trust)
        return addrs.slice(1).reverse()
      })
      session.ip = ws.upgradeReq.ip
      session.ips = ws.upgradeReq.ips
    }

    event.enableEvent(session)
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
      !json.ip && (json.ip = session.ip)
      !json.ips && (json.ips = session.ips)
      json.ips && json.ips.length && (json.ip = json.ips[0])
      json.protocol = 'ws'
      let p = router.request(json)
      if (json.id) {
        p
          .then(doc => {
            doc = {
              data: doc || {}
            }
            doc.id = json.id
            ws.send(JSON.stringify(doc))
          })
          .catch(e => {
            let doc = e.data
            if (!doc) {
              doc = Object.assign({}, Err.FA_INTERNALERROR)
              if (e.status !== undefined) {
                doc.status = e.status
              }
              doc.msg = e.message
            }
            doc.msg = error.Err.t(doc.msg, json.lng)
            doc = {
              data: doc
            }
            doc.id = json.id
            ws.send(JSON.stringify(doc))
          })
      }
    })
    ws.onclose = function (event) {
      delete sessions[session.id]
      doc.emit('close', session)
      session.emit('close')
    }
  })

  return doc
}

module.exports = server
