const benchmark = require('benchmark')
const suite = new benchmark.Suite()

const Route = require('../lib/route')

const handle1 = () => {}

const handle2 = () => {
  throw new Error('err')
}

const handle = () => {
  return { ret: 1 }
}

const o = new Route({
  fn: [handle1, handle1, handle]
})
const o2 = new Route({
  fn: [handle1, handle2, handle]
})
suite
  .add('handle', () => {
    o
      .execute({})
      .then(() => {})
  })
  .add('handle, with error', () => {
    o2
      .execute({})
      .then(() => {})
      .catch(() => {})
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
