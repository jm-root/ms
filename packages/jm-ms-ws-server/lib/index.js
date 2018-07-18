const adapter = require('./ws')
const mdl = require('./mdl')

let $ = mdl(adapter)
module.exports = $
