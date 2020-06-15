const Route = require('../lib')

const fn = opts => {
  opts.name = 'jeff'
  return opts
}

const fnFilter = async opts => {
  opts.gender = 1
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

describe('debug', async () => {
  test('chain', async () => {
    const o = new Route([fnFilter, fn])
    o.name = 'test'
    o.logging = true
    o.benchmark = true
    const doc = await o.execute({ abc: 1 })
    expect(doc.gender === 1 && doc.name === 'jeff').toBeTruthy()
  })
})
