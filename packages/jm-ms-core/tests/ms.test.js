const MS = require('../lib')
const utils = require('../lib/utils')

let handle = opts => {
  return opts
}

let ms = new MS()
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
        console.log(doc)
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  test('use', () => {
    ms
      .use(mdlTest)
      .client({uri: 'http://api.jamma.cn'})
      .then(doc => {
        expect(doc).toBeTruthy()
        return doc.get('/')
      })
      .then(function (doc) {
        console.log(doc)
      })
      .catch(function (err) {
        console.log(err)
      })
  })
})
