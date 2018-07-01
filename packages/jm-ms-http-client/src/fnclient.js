import event from 'jm-event'
import utils from 'jm-ms-core/lib/utils'

const defaultPort = 3000
const defaultUri = 'http://localhost:' + defaultPort

let fnclient = function ($) {
  return function (opts = {}, cb = null) {
    let err = null
    let doc = null
    let uri = opts.uri || defaultUri
    let timeout = opts.timeout || 0

    doc = {
      request: function (opts, cb) {
        let r = utils.preRequest.apply(this, arguments)
        opts = r.opts
        cb = r.cb
        let type = opts.type || 'get'
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
          timeout: opts.timeout || timeout,
          headers: headers
        }
        let url = uri + opts.uri
        let p = $[type](url, opts.data, _opts)
        if (!cb) return p

        p
          .then(doc => {
            cb(null, doc.data)
          })
          .catch(e => {
            cb(e, e.response.data)
          })
      }
    }
    event.enableEvent(doc)

    if (cb) cb(err, doc)
    doc.emit('open')
  }
}

export default fnclient
