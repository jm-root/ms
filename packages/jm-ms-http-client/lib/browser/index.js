const axios = require('axios')
const mdl = require('../mdl')

const adapter = {
  async request (url, data, opts) {
    const o = Object.assign({url}, opts)
    if (data) {
      const {method} = o
      if (method === 'post' || method === 'put' || method === 'patch') {
        o.data = data
      } else {
        o.params = data
      }
    }
    return axios(o)
  }
}

let $ = mdl(adapter)
$.createModule = mdl // deprecated
module.exports = $
