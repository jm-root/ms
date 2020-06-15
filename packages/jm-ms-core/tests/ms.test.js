const MS = require('../lib')
const utils = require('../lib/utils')

const handle = opts => {
  return opts
}

const ms = new MS({
  logging: true,
  benchmark: true
})
const app = ms.router()

const mdlTest = function () {
  const app = this
  app.clientModules.http = () => {
    const client = {
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
      .then(function () {
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  test('router use', () => {
    const r1 = ms.router()
    r1.add('/', 'get', () => { return { ret: 1 } })
    const r2 = ms.router()
    r2.add('/', 'get', () => { return { ret: 2 } })
    app
      .clear()
      .use(r1)
      .use('/r2', r2)
      .get('/r2')
      .then(function () {
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  test('use', () => {
    ms
      .use(mdlTest)
      .client({ uri: 'http://api.jamma.cn' })
      .then(doc => {
        expect(doc).toBeTruthy()
        return doc.get('/')
      })
      .then(function () {
      })
      .catch(function (err) {
        console.log(err)
      })
  })
})
