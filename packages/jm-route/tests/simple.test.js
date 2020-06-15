const Route = require('../')

const fn = opts => {
  opts.name = 'jeff'
  return opts
}

const fnFilter = opts => {
  opts.gender = 1
}

const fnErr = () => {
  throw new Error('err message')
}

describe('simple', async () => {
  test('one function', async () => {
    const o = new Route(fn)
    const doc = await o.execute({})
    console.log(doc)
    expect(doc.name === 'jeff').toBeTruthy()
  })

  test('chain', async () => {
    const o = new Route([fnFilter, fn])
    const doc = await o.execute({})
    console.log(doc)
    expect(doc.gender === 1 && doc.name === 'jeff').toBeTruthy()
  })

  test('chain with error', async done => {
    const o = new Route(fnFilter, fnErr, fn)
    try {
      await o.execute({})
    } catch (e) {
      expect(e).toBeTruthy()
    }

    o
      .execute({})
      .catch(e => {
        expect(e).toBeTruthy()
        done()
      })
  })
})
