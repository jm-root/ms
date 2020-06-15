const benchmark = require('benchmark')
const suite = new benchmark.Suite()

const Route = require('../lib')

const handle1 = () => {}

const handle = () => {
  return { ret: 1 }
}

const o1 = new Route(handle)
const o2 = new Route(handle1, handle)
suite
  .add('handle function', async () => {
    const opts = {}
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
