const event = require('jm-event')
const error = require('jm-err')
const utils = require('jm-ms-core').utils

const fnclient = function (_adapter) {
  return function (opts = {}) {
    if (typeof opts === 'string') {
      opts = { uri: opts }
    }
    if (!opts.uri) throw error.err(error.Err.FA_PARAMS)
    const adapter = opts.adapter || _adapter
    const uri = opts.uri
    const timeout = opts.timeout || 0

    const doc = {
      async request (opts) {
        opts = utils.preRequest.apply(this, arguments)
        const headers = opts.headers || {}
        const noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection']
        noHeaders.forEach(function (key) {
          if (headers[key]) delete headers[key]
        })
        if (opts.ips) {
          headers['x-forwarded-for'] = opts.ips.toString()
        }
        if (opts.lng) {
          headers.lng = opts.lng
        }

        const _opts = {
          method: opts.type || 'get',
          timeout: opts.timeout || timeout,
          headers: headers
        }

        if (opts.options) {
          Object.assign(_opts, opts.options)
        }

        const url = uri + opts.uri
        try {
          const doc = await adapter.request(url, opts.data, _opts)
          const data = doc.data
          if (data && data.err) {
            const e = error.err(data)
            throw e
          }
          return data
        } catch (e) {
          let data = null
          e.response && e.response.data && (data = e.response.data)
          if (data && data.err) {
            const e = error.err(data)
            throw e
          }
          data && (e.data = data)
          throw e
        }
      },
      async notify () {
        await this.request.apply(this, arguments)
      },
      onReady () {
        return true
      }
    }
    event.enableEvent(doc)
    return doc
  }
}

module.exports = fnclient
