const benchmark = require('benchmark')
const suite = new benchmark.Suite()

let Router = require('../lib/router')

const handle1 = opts => {}

const handle2 = opts => {
  throw new Error('err')
}

const handle = opts => {
  return { ret: 1 }
}

let r1 = new Router()
r1.use(handle1, handle1, handle)
let r2 = new Router()
r2.use(handle1, handle2, handle)

suite
  .add('request', () => {
    r1
      .request('/')
      .then(() => {})
      .catch(e => {})
  })
  .add('request, with error', () => {
    r2
      .request('/')
      .then(() => {})
      .catch(e => {})
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
