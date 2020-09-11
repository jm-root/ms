const axios = require('axios')
const qs = require('qs')
const mdl = require('../mdl')

const adapter = {
  async request (url, data, opts) {
    const o = Object.assign({ url }, opts)
    if (data) {
      const { method } = o
      if (method === 'post' || method === 'put' || method === 'patch') {
        o.data = data
      } else {
        o.params = data
        o.paramsSerializer = function (params) {
          return qs.stringify(params, { encodeValuesOnly: true })
        }
      }
    }
    return axios(o)
  }
}

module.exports = mdl(adapter)
