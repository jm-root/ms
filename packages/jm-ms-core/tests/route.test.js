const Route = require('../lib/route')

const handle1 = async (opts = {}) => {
  opts.name = 'jeff'
}

const handle2 = async () => {
  throw new Error('err message')
}

const handle = (opts = {}) => {
  opts.sex = 1
  return opts
}

describe('route', () => {
  test('Route', () => {
    const o = new Route({
      fn: handle
    })
    expect(o).toBeTruthy()
  })

  test('handle', async () => {
    const o = new Route({
      fn: handle
    })
    o.logging = true
    const doc = await o.execute({})
    expect(doc.sex).toBeTruthy()
  })

  test('handle chain', async () => {
    const o = new Route({
      fn: [handle1, handle]
    })
    const doc = await o.execute({})
    expect(doc.sex).toBeTruthy()
  })

  test('handle chain error', async () => {
    const o = new Route({
      fn: [handle1, handle2, handle]
    })

    let err
    try {
      await o.execute({})
    } catch (e) {
      err = e
    }
    expect(err).toBeTruthy()
  })
})
