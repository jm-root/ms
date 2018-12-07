const benchmark = require('benchmark')
const suite = new benchmark.Suite()

let Route = require('../lib')

let handle1 = (opts) => {
}

let handle = (opts) => {
  return { ret: 1 }
}

let o1 = new Route(handle)
let o2 = new Route(handle1, handle)
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
  .add('handle, with filter', async () => {
    await o2.execute({})
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

if (require.main === module) {
  suite.run({ async: true })
} else {
  module.exports = suite
}
