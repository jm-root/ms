const Fly = require('flyio/dist/npm/fly')
const mdl = require('../mdl')

let fly = new Fly()
let $ = mdl(fly)
module.exports = $
