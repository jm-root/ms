'use strict'
const benchmark = require('benchmark')
benchmark.options.maxTime = 1

require('./route').run({ async: true })
