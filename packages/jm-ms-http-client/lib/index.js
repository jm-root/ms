const axios = require('axios')
const http = require('http')
const https = require('https')
const qs = require('qs')
const mdl = require('./mdl')

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

// axios 比 flyio 快3倍, 所以服务器端选用 axios
const adapter = {
  async request (url, data, opts) {
    const o = Object.assign({ url, httpAgent, httpsAgent }, opts)
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
