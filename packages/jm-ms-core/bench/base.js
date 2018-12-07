const benchmark = require('benchmark')
const suite = new benchmark.Suite()

function test (name, value) {
  name = name + value
}

let o = {}

let v = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
}

let a = ['a', 'b']

suite
  .add('for', () => {
    let vals = new Array(a.length)
    for (let i = 0; i < a.length; i++) {
      vals[i] = v[a[i]]
    }
  })
  .add('forEach', () => {
    let o = {}
    a.forEach(function (key) {
      o[key] = v[key]
    })
  })
  .add('for in', () => {
    let o = {}
    for (let key in v) {
      o[key] = v[key]
    }
  })
  .add('bind', () => {
    test.bind(o)('jeff', 123)
  })
  .add('bind =', () => {
    o.test = null
    o.test = test
    o.test('jeff', 123)
  })
  .add('function, no params', () => {
    test()
  })
  .add('function, with params', () => {
    test('jeff', 123)
  })
  .add('call, no params', () => {
    test.call(o)
  })
  .add('call, with params', () => {
    test.call(o, 'jeff', 123)
  })
  .add('apply, no params', () => {
    test.apply(o)
  })
  .add('apply, with params', () => {
    test.apply(o, ['jeff', 123])
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
