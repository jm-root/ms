const { EventEmitter } = require('jm-event')
const MS = require('jm-ms-core')
const { utils } = MS
const ms = new MS()

const { err, Err } = require('jm-err')
const log = require('jm-logger')

const Timeout = 60000 // 请求超时时间 60 秒
const MAXID = 999999

module.exports = class extends EventEmitter {
  constructor (opts = {}) {
    super()

    const { debug = false, timeout = Timeout, logger = log.logger, router = ms.router() } = opts

    debug && (logger.level = 'debug')

    Object.assign(this, {
      debug,
      timeout,
      logger,
      router
    })

    this.reset()

    this.on('message', this.onMessage.bind(this))
  }

  reset () {
    Object.assign(this, {
      requestId: 0,
      cbs: {}
    })
  }

  nextRequestId () {
    if (this.requestId >= MAXID) this.requestId = 0
    return ++this.requestId
  }

  // send request to remote
  request (opts) {
    opts = utils.preRequest.apply(this, arguments)
    opts.id || (opts.id = this.nextRequestId())

    const { cbs, timeout: defaultTimeout } = this
    const { id, timeout = defaultTimeout } = opts

    const p = new Promise((resolve, reject) => {
      cbs[id] = {
        resolve,
        reject
      }

      setTimeout(() => {
        if (cbs[id]) {
          delete cbs[id]
          reject(err(Err.FA_TIMEOUT))
        }
      }, timeout)
    })

    this.send(JSON.stringify(opts))

    return p
  }

  // send request to remote
  notify (opts) {
    opts = utils.preRequest.apply(this, arguments)
    this.send(JSON.stringify(opts))
  }

  // received request from remote and send response to remote
  async onRequest (opts) {
    const { id } = opts
    const { debug, logger } = this
    let data = null
    try {
      data = await this.router.request(opts)
      if (debug) {
        logger.debug(`ok. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(data, null, 2)}`)
      }
    } catch (e) {
      if (debug) {
        logger.debug(`fail. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(e.data, null, 2)}`)
      }
      logger.error(e)
      data = e.data
      data || (data = Object.assign({ status: e.status || Err.FA_INTERNALERROR.err }, Err.FA_INTERNALERROR, { msg: e.message }))
    }
    if (id) {
      this.send(JSON.stringify({
        id, data: data || {}
      }))
    }
  }

  // received response from remote
  onResponse (opts) {
    const { id, data: doc } = opts
    const p = this.cbs[id]
    if (!p) return

    delete this.cbs[id]

    if (doc && doc.err) {
      p.reject(err(doc))
    } else {
      p.resolve(doc)
    }
  }

  onMessage (message) {
    this.debug && (this.logger.debug(`message received: ${message}`))
    let json = null
    try {
      json = JSON.parse(message)
    } catch (err) {
      return
    }

    const { id, uri } = json

    // received request or notify
    if (uri) {
      return this.onRequest(json)
    }

    // received response
    if (id) {
      return this.onResponse(json)
    }
  }

  send () {
    throw new Error('method send not implemented.')
  }
}
