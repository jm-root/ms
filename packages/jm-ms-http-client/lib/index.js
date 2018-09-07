const fly = require('flyio')
const mdl = require('./mdl')

let $ = mdl(fly)
$.createModule = mdl
module.exports = $
