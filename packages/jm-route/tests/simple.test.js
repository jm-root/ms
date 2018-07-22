const Route = require('../lib')

let fn = (opts) => {
  opts.name = 'jeff'
  return opts
}

let fnFilter = (opts) => {
  opts.sex = 1
}

let fnErr = () => {
  throw new Error('err message')
}

describe('simple', async () => {
  test('one function', async () => {
    let o = new Route(fn)
    let doc = await o.execute({})
    console.log(doc)
    expect(doc.name === 'jeff').toBeTruthy()
  })

  test('chain', async () => {
    let o = new Route([fnFilter, fn])
    let doc = await o.execute({})
    console.log(doc)
    expect(doc.sex === 1 && doc.name === 'jeff').toBeTruthy()
  })

  test('chain with error', async () => {
    let o = new Route(fnFilter, fnErr, fn)
    try {
      await o.execute({})
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })
})
