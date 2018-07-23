const Route = require('../lib')

let fn = opts => {
  opts.name = 'jeff'
  return opts
}

let fnFilter = async opts => {
  opts.gender = 1
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

describe('debug', async () => {
  test('chain', async () => {
    let o = new Route([fnFilter, fn])
    o.name = 'test'
    o.logging = true
    o.benchmark = true
    let doc = await o.execute({abc: 1})
    expect(doc.gender === 1 && doc.name === 'jeff').toBeTruthy()
  })
})
