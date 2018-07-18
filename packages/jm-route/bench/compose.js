const benchmark = require('benchmark')
const suite = new benchmark.Suite()

var compose = require('../lib/compose')

var handle1 = (opts) => {
}

var handle2 = (opts) => {
  throw new Error('err')
}

var handle = (opts) => {
  return {ret: 1}
}

async function f1 () {
  let opts = {}
  await
    handle1(opts)
  await
    handle1(opts)
  await
    handle(opts)
}

var o = compose(handle1, handle2, handle)
var o2 = compose(handle1, handle1, handle)
suite
  .add('handle function', async () => {
    let opts = {}
    await handle1(opts)
    await handle1(opts)
    await handle(opts)
  })
  .add('handle with error', async () => {
    try {
      await f1({})
    } catch (e) {}
  })
  .add('handle, without error', async () => {
    await o2({})
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
