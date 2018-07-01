const Route = require('../src/route')

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

  test('match', () => {
    let o = new Route({
      uri: '/',
      fn: handle
    })
    expect(o.match()).not.toBeTruthy()
    expect(o.uri === undefined && o.params === undefined).toBeTruthy()
    expect(o.match('/')).toBeTruthy()
    expect(o.uri === '/' && o.params).toBeTruthy()
    expect(!o.match('/abc')).toBeTruthy()

    o = new Route({
      end: false,
      fn: handle
    })
    expect(o.match()).not.toBeTruthy()
    expect(o.uri === undefined && o.params === undefined).toBeTruthy()
    expect(o.match('')).toBeTruthy()
    expect(o.uri === '' && o.params).toBeTruthy()
    expect(o.match('/')).toBeTruthy()
    expect(o.uri === '' && o.params).toBeTruthy()
    expect(o.match('/abc')).toBeTruthy()
    expect(o.uri === '' && o.params).toBeTruthy()

    o = new Route({
      uri: '/',
      fn: handle,
      type: 'get'
    })
    expect(o.match('/', 'get')).toBeTruthy()
    expect(o.uri === '/' && o.params).toBeTruthy()
    expect(o.match('/abc')).not.toBeTruthy()
    expect(o.uri === undefined && o.params === undefined).toBeTruthy()
  })

  test('handle', async () => {
    let o = new Route({
      fn: handle
    })
    let doc = await o.handle({})
    console.log(doc)
  })

  test('handle chain', async () => {
    let o = new Route({
      fn: [handle1, handle]
    })
    let t0 = Date.now()
    let doc = await o.handle({})
    console.log(`time: ${ Date.now() - t0}`)
    console.log(doc)
  })

  test('handle chain error', async () => {
    let o = new Route({
      fn: [handle1, handle2, handle]
    })
    let t0 = Date.now()
    o
      .handle({})
      .catch(e => {
        console.log(`time: ${ Date.now() - t0}`)
        console.log(e)
      })
  })

})
