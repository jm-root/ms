const benchmark = require('benchmark')
const suite = new benchmark.Suite()

var Route = require('../lib')

var handle1 = (opts) => {
}

var handle2 = (opts) => {
  throw new Error('err')
}

var handle = (opts) => {
  return {ret: 1}
}

var o = new Route(handle1, handle2, handle)
var o1 = new Route(handle)
var o2 = new Route(handle1, handle)
suite
  .add('handle function', async () => {
    let opts = {}
    await handle1(opts)
    await handle1(opts)
    await handle(opts)
  })
  .add('handle', async () => {
    await o1.execute({})
  })
  .add('handle, without error', async () => {
    await o2.execute({})
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
