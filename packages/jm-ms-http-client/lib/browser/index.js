const Fly = require('flyio/dist/npm/fly')
const mdl = require('../mdl')

let fly = new Fly()
let $ = mdl(fly)
$.createModule = mdl
module.exports = $
