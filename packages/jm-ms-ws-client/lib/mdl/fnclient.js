const event = require('jm-event')
const log = require('jm-logger')
const utils = require('jm-ms-core').utils
const error = require('jm-err')
const WS = require('./ws')

const Err = error.Err

const MAXID = 999999
let errNetwork = error.err(Err.FA_NETWORK)

let fnclient = function (_Adapter) {
  return async function (opts = {}) {
    if (typeof opts === 'string') {
      opts = {uri: opts}
    }

    const {uri, logger = log.logger} = opts
    let {prefix = '',} = opts

    if (!uri) throw error.err(error.Err.FA_PARAMS)

    let path = utils.getUriPath(uri)
    prefix = path + prefix

    let id = 0
    let cbs = {}

    const ws = new WS(Object.assign({Adapter: _Adapter}, opts))
    ws.connect(uri)

    const doc = {
      uri,
      prefix,

      onReady: function () {
        return ws.onReady()
      },

      async request (opts) {
        await this.onReady()
        opts = utils.preRequest.apply(this, arguments)
        opts.uri = this.prefix + (opts.uri || '')
        if (id >= MAXID) id = 0
        id++
        opts.id = id
        this.send(JSON.stringify(opts))
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
        this.send(JSON.stringify(opts))
      },

      send: function () {
        logger.debug('ws.send', ...arguments)
        ws.send(...arguments)
      },

      close: function () {
        ws.close()
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

    ws
      .on('heartBeat', () => {
        doc.emit('heartBeat')
        doc.request('/')
        return true
      })
      .on('connect', () => {
        doc.emit('connect')
      })
      .on('message', message => {
        logger.debug('ws.received', message)
        onmessage(message)
      })
      .on('open', () => {
        id = 0
        cbs = {}
        doc.emit('open')
      })
      .on('error', e => {
        doc.emit('error', e)
      })
      .on('close', event => {
        doc.emit('close', event)
      })

    return doc
  }
}

module.exports = fnclient
