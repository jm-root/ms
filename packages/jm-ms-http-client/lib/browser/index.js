const axios = require('axios')
const mdl = require('../mdl')

const adapter = {
  async request (url, data, opts) {
    const o = Object.assign({url, data}, opts)
    return axios(o)
  }
}

let $ = mdl(adapter)
$.createModule = mdl
module.exports = $
