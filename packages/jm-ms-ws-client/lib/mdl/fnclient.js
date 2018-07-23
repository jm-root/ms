const event = require('jm-event')
const utils = require('jm-ms-core/lib/utils')
const error = require('jm-err')

const Err = error.Err

const MAXID = 999999
let errNetwork = error.err(Err.FA_NETWORK)

let fnclient = function (_Adapter) {
  return async function (opts = {}) {
    if (typeof opts === 'string') {
      opts = {uri: opts}
    }
    if (!opts.uri) throw error.err(error.Err.FA_PARAMS)
    let Adapter = opts.Adapter || _Adapter
    let doc = null
    let uri = opts.uri
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

      onReady: function () {
        let self = this
        return new Promise(function (resolve, reject) {
          if (self.connected) return resolve(self.connected)
          self.on('open', function () {
            resolve(self.connected)
          })
        })
      },

      async request (opts) {
        await this.onReady()
        opts = utils.preRequest.apply(this, arguments)
        if (!this.connected) throw errNetwork
        opts.uri = this.prefix + (opts.uri || '')
        if (id >= MAXID) id = 0
        id++
        opts.id = id
        ws.send(JSON.stringify(opts))
        return new Promise((resolve, reject) => {
          cbs[id] = {
            resolve,
            reject
          }
        })
      },

      async notify (opts) {
        await this.onReady()
        opts = utils.preRequest.apply(this, arguments)
        if (!this.connected) throw errNetwork
        opts.uri = this.prefix + (opts.uri || '')
        ws.send(JSON.stringify(opts))
      },

      send: function () {
        if (!this.connected) throw errNetwork
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
          let p = cbs[json.id]
          let err = null
          let doc = json.data
          if (doc.err) {
            err = error.err(doc)
            p.reject(err)
          } else {
            p.resolve(doc)
          }
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
      ws = new Adapter(this.uri)
      ws.on('message', message => {
        onmessage(message)
      })
      ws.on('open', () => {
        id = 0
        cbs = {}
        self.connected = true
        self.emit('open')
      })
      ws.on('error', event => {
        doc.emit('error', event)
      })
      ws.on('close', event => {
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
      })
    }
    doc.connect()
    return doc
  }
}

module.exports = fnclient
