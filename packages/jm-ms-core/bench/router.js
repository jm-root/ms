const benchmark = require('benchmark')
const suite = new benchmark.Suite()

var Router = require('../lib/router')

var handle1 = (opts, cb, next) => {
  next()
}

var handle2 = (opts, cb, next) => {
  next(new Error('err'), {ret: 0})
}

var handle = (opts, cb, next) => {
  cb(null, {ret: 1})
}

var cb = (err, doc) => {
  //if (err) console.log(err.stack);
  //console.log('%j', doc);
}

var r1 = new Router()
r1.use(handle1, handle2, handle)
var r2 = new Router()
r2.use(handle)

suite
  .add('request', () => {
    r1.request('/', cb)
  })
  .add('request, without error', () => {
    r2.request('/', 1000, cb)
  })
  .add('request, opts', () => {
    r2.request({uri: '/'}, cb)
  })
  .add('handle, without error', () => {
    r2.handle({uri: '/'}, cb)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })


if (require.main === module) {
  suite.run({async: true})
} else {
  module.exports = suite
}
