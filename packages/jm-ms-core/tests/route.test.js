const Route = require('../lib/route')

let handle1 = async (opts = {}) => {
  opts.name = 'jeff'
}

let handle2 = async (opts = {}) => {
  throw new Error('err message')
}

let handle = (opts = {}) => {
  opts.sex = 1
  return opts
}

let cb = (err, doc) => {
  if (err) console.log(err.stack)
  console.log('%j', doc)
}

describe('route', () => {
  test('Route', () => {
    let o = new Route({
      fn: handle
    })
    expect(o).toBeTruthy()
  })

  test('handle', async () => {
    let o = new Route({
      fn: handle
    })
    let doc = await o.execute({})
    expect(doc.sex).toBeTruthy()
  })

  test('handle chain', async () => {
    let o = new Route({
      fn: [handle1, handle]
    })
    let doc = await o.execute({})
    expect(doc.sex).toBeTruthy()
  })

  test('handle chain error', async () => {
    let o = new Route({
      fn: [handle1, handle2, handle]
    })
    let t0 = Date.now()
    o
      .execute({})
      .catch(e => {
        expect(e).toBeTruthy()
      })
  })

})
