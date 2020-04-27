const MS = require('../lib')
const utils = require('../lib/utils')

let handle = opts => {
  return opts
}

let ms = new MS({
  logging: true,
  benchmark: true
})
let app = ms.router()

let mdlTest = function (opts) {
  let app = this
  app.clientModules.http = (opts) => {
    let client = {
      request: function (opts) {
        opts = utils.preRequest.apply(this, arguments)
        return opts
      }
    }
    return client
  }

  return {
    name: 'test',
    unuse: () => {
      delete app.clientModules.http
    }
  }
}

describe('ms', () => {
  test('router', () => {
    expect(app).toBeTruthy()
    app
      .add('/', 'get', handle)
      .get('/')
      .then(function (doc) {
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  test('router use', () => {
    let r1 = ms.router()
    r1.add('/', 'get', () => { return { ret: 1 } })
    let r2 = ms.router()
    r2.add('/', 'get', () => { return { ret: 2 } })
    app
      .clear()
      .use(r1)
      .use('/r2', r2)
      .get('/r2')
      .then(function (doc) {
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  test('use', () => {
    const client = ms
      .use(mdlTest)
      .client({ uri: 'http://api.jamma.cn' })

    client.get('/')
      .then(function (doc) {
      })
      .catch(function (err) {
        console.log(err)
      })
  })
})
