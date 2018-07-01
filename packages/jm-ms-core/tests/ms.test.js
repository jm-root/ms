const MS = require('../src')
const utils = require('../src/utils')

let handle = (opts, cb, next) => {
  cb(null, {ret: 1})
}

let cb = (err, doc) => {
  if (err) console.log(err.stack)
  if (doc) console.log('%j', doc)
}

let msTest = new MS()
let app = msTest.router()

let mdlTest = function (opts, cb) {
  let app = this
  app.clientModules.http = (opts, cb) => {
    let client = {
      request: function (opts, cb) {
        let r = utils.preRequest.apply(this, arguments)
        r.cb(null, {ret: true})
      }
    }
    cb(null, client)
    return true
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
    app.add('/', handle)
    app.request('/', cb)
  })

  test('router promise', () => {
    expect(app).toBeTruthy()
    app.add('/', 'get', handle)
    app.get('/')
      .then(function (doc) {
        cb(null, doc)
      })
      .catch(function (err) {
        cb(err)
      })
  })

  test('use', () => {
    msTest.use(mdlTest)
    msTest.client({uri: 'http://ww.ja.cnom'}, function (err, doc) {
      expect(doc).toBeTruthy()
      doc.get('/', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
    })
  })
})
