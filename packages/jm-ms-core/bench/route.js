const benchmark = require('benchmark')
const suite = new benchmark.Suite()

var Route = require('../lib/route')

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

var o = new Route({
  fn: [handle1, handle2, handle]
})
var o2 = new Route({
  fn: [handle1, handle1, handle]
})
suite
  .add('handle', () => {
    o.handle({}, cb, cb)
  })
  .add('handle, without error', () => {
    o2.handle({}, cb, cb)
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
