const axios = require('axios')
const http = require('http')
const https = require('https')
const qs = require('qs')
const mdl = require('./mdl')

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })
const maxContentLength = 31457280 // 默认请求体大小上限 30m

// axios 比 flyio 快3倍, 所以服务器端选用 axios
const adapter = {
  async request (url, data, opts) {
    const o = Object.assign({ url, httpAgent, httpsAgent, maxContentLength }, opts)
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
