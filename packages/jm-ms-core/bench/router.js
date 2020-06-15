const benchmark = require('benchmark')
const suite = new benchmark.Suite()

const Router = require('../lib/router')

const handle1 = () => {}

const handle2 = () => {
  throw new Error('err')
}

const handle = () => {
  return { ret: 1 }
}

const r1 = new Router()
r1.use(handle1, handle1, handle)
const r2 = new Router()
r2.use(handle1, handle2, handle)

suite
  .add('request', () => {
    r1
      .request('/')
      .then(() => {})
      .catch(() => {})
  })
  .add('request, with error', () => {
    r2
      .request('/')
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
