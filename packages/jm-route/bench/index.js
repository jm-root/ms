'use strict'
const benchmark = require('benchmark')
benchmark.options.maxTime = 1

require('./err').run({async: true})
