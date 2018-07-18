const event = require('jm-event')
const utils = require('jm-ms-core/lib/utils')

const defaultPort = 3000
const defaultUri = 'http://localhost:' + defaultPort

let fnclient = function (_adapter) {
  return async function (opts = {}) {
    let adapter = opts.adapter || _adapter
    let uri = opts.uri || defaultUri
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
          return doc.data
        } catch (e) {
          e.response && e.response.data && (e.data = e.response.data)
          throw e
        }
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
