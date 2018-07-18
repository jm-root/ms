const adapter = require('./express')
const mdl = require('./mdl')

let $ = mdl(adapter)
module.exports = $
