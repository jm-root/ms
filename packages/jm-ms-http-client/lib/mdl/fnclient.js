const event = require('jm-event')
const error = require('jm-err')
const utils = require('jm-ms-core/lib/utils')

let fnclient = function (_adapter) {
  return async function (opts = {}) {
    if (typeof opts === 'string') {
      opts = {uri: opts}
    }
    if (!opts.uri) throw error.err(error.Err.FA_PARAMS)
    let adapter = opts.adapter || _adapter
    let uri = opts.uri
    let timeout = opts.timeout || 0

    let doc = {
      async request (opts) {
        opts = utils.preRequest.apply(this, arguments)
        let headers = opts.headers || {}
        let noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection']
        noHeaders.forEach(function (key) {
          if (headers[key]) delete headers[key]
        })
        if (opts.ips) {
          headers['x-forwarded-for'] = opts.ips.toString()
        }
        if (opts.lng) {
          headers['lng'] = opts.lng
        }

        let _opts = {
          method: opts.type || 'get',
          timeout: opts.timeout || timeout,
          headers: headers
        }
        let url = uri + opts.uri
        try {
          let doc = await adapter.request(url, opts.data, _opts)
          let data = doc.data
          if (data && data.err) {
            let e = error.err(data)
            throw e
          }
          return data
        } catch (e) {
          let data = null
          e.response && e.response.data && (data = e.response.data)
          if (data && data.err) {
            let e = error.err(data)
            throw e
          }
          throw e
        }
      },
      async notify (opts) {
        await this.request.apply(this, arguments)
      },
      async onReady () {
        return true
      }
    }
    event.enableEvent(doc)
    return doc
  }
}

module.exports = fnclient
