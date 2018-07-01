import event from 'jm-event'
import utils from 'jm-ms-core/lib/utils'
import error from 'jm-err'

const Err = error.Err

const MAXID = 999999
const defaultPort = 3100
const defaultUri = 'ws://localhost:' + defaultPort
let errNetwork = error.err(Err.FA_NETWORK)

let fnclient = function (fnCreateWS) {
  return function (opts = {}, cb = null) {
    let err = null
    let doc = null
    let uri = opts.uri || defaultUri
    let timeout = opts.timeout || 0
    let id = 0
    let cbs = {}
    let path = utils.getUriPath(uri)
    let prefix = opts.prefix || ''
    prefix = path + prefix
    let ws = null
    let autoReconnect = true
    if (opts.reconnect === false) autoReconnect = false
    let reconnectTimer = null
    let reconnectionDelay = opts.reconnectionDelay || 5000
    let DEFAULT_MAX_RECONNECT_ATTEMPTS = 0 // 默认重试次数0 表示无限制
    let maxReconnectAttempts = opts.reconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS

    doc = {
      uri: uri,
      prefix: prefix,
      connected: false,
      autoReconnect: autoReconnect,
      reconnectAttempts: 0,
      reconnectionDelay: reconnectionDelay,
      maxReconnectAttempts: maxReconnectAttempts,

      request: function (opts, cb) {
        let r = utils.preRequest.apply(this, arguments)
        opts = r.opts
        cb = r.cb
        if (!this.connected) return cb(errNetwork, Err.FA_NETWORK)
        opts.uri = this.prefix + (opts.uri || '')
        if (cb) {
          if (id >= MAXID) id = 0
          id++
          cbs[id] = cb
          opts.id = id
        }
        ws.send(JSON.stringify(opts))
      },
      send: function () {
        if (!this.connected) return
        ws.send.apply(ws, arguments)
      },
      close: function () {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer)
          reconnectTimer = null
        }
        this.autoReconnect = false
        this.reconnectAttempts = 0
        if (!this.connected) return
        ws.close()
        ws = null
      }
    }
    event.enableEvent(doc)

    let onmessage = function (message) {
      doc.emit('message', message)
      let json = null
      try {
        json = JSON.parse(message)
      } catch (err) {
        return
      }
      if (json.id) {
        if (cbs[json.id]) {
          let err = null
          let doc = json.data
          if (doc.err) {
            err = new Error(doc.msg)
          }
          cbs[json.id](err, doc)
          delete cbs[json.id]
        }
      }
    }

    doc.connect = function () {
      if (this.connected) return
      if (ws) return
      this.autoReconnect = autoReconnect
      doc.emit('connect')
      let self = doc
      let onopen = function (event) {
        id = 0
        cbs = {}
        self.connected = true
        self.emit('open')
      }
      let onclose = function (event) {
        self.connected = false
        ws = null
        self.emit('close', event)
        if (self.autoReconnect) {
          if (self.maxReconnectAttempts && self.reconnectAttempts >= self.maxReconnectAttempts) {
            self.emit('connectFail')
            return
          }
          self.reconnectAttempts++
          self.emit('reconnect')
          reconnectTimer = setTimeout(function () {
            reconnectTimer = null
            self.connect()
          }, self.reconnectionDelay)
        }
      }
      let onerror = function (event) {
        doc.emit('error', event)
      }
      ws = fnCreateWS(this.uri, onmessage)
      ws.onopen = onopen
      ws.onerror = onerror
      ws.onclose = onclose
    }

    if (cb) cb(err, doc)
    doc.connect()
  }
}

export default fnclient
