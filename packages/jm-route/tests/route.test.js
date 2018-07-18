const Route = require('../lib')

let fn = (opts = {}) => {
  opts.sex = 1
  return opts
}

let fn1 = async (opts = {}) => {
  opts.name = 'jeff'
}

let fn2 = async (opts = {}) => {
  throw new Error('err message')
}

let cb = (err, doc) => {
  if (err) console.log(err.stack)
  console.log('%j', doc)
}

describe('route', async () => {

  test('execute', async () => {
    let o = new Route(fn)
    let doc = await o.execute({})
    expect(doc.sex === 1).toBeTruthy()
  })

  test('fn chain', async () => {
    let o = new Route([fn1, fn])
    let doc = await o.execute({})
    expect(doc.sex === 1 && doc.name === 'jeff').toBeTruthy()
  })

  test('fn chain error', async () => {
    let o = new Route(fn1, fn2, fn)
    let t0 = Date.now()
    o
      .execute({})
      .catch(e => {
        expect(e).toBeTruthy()
      })
  })

})
