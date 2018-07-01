const Route = require('../src/route')

let cb_default = () => {
}

class Context {
  get callback () {
    return this._cb || cb_default
  }

  set callback (val) {
    this._cb = cb
  }

  set body (val) {
    this.callback(null, val)
  }

  set error (val) {
    this.callback(val)
  }

  handle (opts, cb, next) {
    this.params = opts.params
  }
}

let h = function (opts) {
  this.body = {ret: 123}
}

let ctx = new Context()
ctx.handle = h
ctx.handle()

let handle1 = (opts, cb, next) => {
  next()
}

let handle2 = (opts, cb, next) => {
  next(new Error('err'), {ret: 0})
}

let handle = (opts, cb, next) => {
  cb(null, {ret: 1})
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
    expect(o.match('/abc')).not.toBeTruthy()

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

  test('handle', () => {
    let o = new Route({
      fn: handle
    })
    o.handle({}, cb, cb)

    o = new Route({
      fn: [handle1, handle2, handle]
    })
    o.handle({}, cb, cb)
  })
})
