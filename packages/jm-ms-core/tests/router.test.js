const Router = require('../src/router')

let handle1 = (opts, cb, next) => {
  console.log('handle1')
  next()
}

let handle2 = (opts, cb, next) => {
  next(new Error('err'), {ret: 0})
}

let handle = (opts, cb, next) => {
  cb(null, {ret: true})
}

let cb = (err, doc) => {
  if (err) console.log(err.stack)
  if (doc) console.log('%j', doc)
}

let o = new Router({
  sensitive: true,
  strict: true
})

describe('router', () => {
  test('add', () => {
    o
      .clear()
      // * add({uri:uri, type:type, fn:fn}, cb)
      .add({
        uri: '/t1',
        type: 'get',
        fn: handle
      }, cb)
      .get('/t1', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
      .add({
        uri: '/t2',
        type: 'get',
        fn: [handle1, handle]
      }, cb)
      .get('/t2', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * 可以没有回调函数cb
      // * add({uri:uri, type:type, fn:fn})
      .add({
        uri: '/t3',
        type: 'get',
        fn: handle
      })
      .get('/t3', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
      .add({
        uri: '/t4',
        type: 'get',
        fn: [handle1, handle]
      })
      .get('/t4', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * 以下用法不能包含cb
      // * add(uri, fn)
      .add('/t5', handle)
      .get('/t5', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add(uri, fn1, fn2, ..., fnn)
      .add('/t6', handle1, handle)
      .get('/t6', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add(uri, [fn1, fn2, ..,fnn])
      .add('/t7', [handle1, handle])
      .get('/t7', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add(uri, type, fn)
      .add('/t8', 'get', handle)
      .get('/t8', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * add(uri, type, fn1, fn2, ..., fnn)
      .add('/t9', 'get', handle1, handle)
      .get('/t9', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * add(uri, type, [fn1, fn2, ..,fnn])
      .add('/t10', 'get', [handle1, handle])
      .get('/t10', function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
  })

  test('use', () => {
    let uri = '/test'
    let fn = handle
    let fns = [handle1, handle2]
    let router = new Router()
    router.use(fn)
    o
      .clear()
      // * 支持多种参数格式, 例如
      // * use({uri:uri, fn:fn}, cb)
      .clear()
      .use({uri: uri, fn: fn}, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
      .clear()
      .use({uri: uri, fn: fns}, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:router}, cb)
      .clear()
      .use({uri: uri, fn: router}, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:obj}, cb)
      .clear()
      .use({
        uri: uri,
        fn: {
          handle: fn
        }
      }, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      .clear()
      .use({
        uri: uri,
        fn: {
          request: fn
        }
      }, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use(router, cb)
      .clear()
      .use(router, cb)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * 可以没有回调函数cb
      // * use({uri:uri, fn:fn})
      .clear()
      .use({uri: uri, fn: fn})
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
      .clear()
      .use({uri: uri, fn: fns})
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:router})
      .clear()
      .use({uri: uri, fn: router})
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use({uri:uri, fn:obj})
      .clear()
      .use({
        uri: uri,
        fn: {
          request: fn
        }
      })
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      .clear()
      .use({
        uri: uri,
        fn: {
          handle: fn
        }
      })
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(router)
      .clear()
      .use(router)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(obj) obj必须实现了request或者handle函数之一，优先使用request
      // * 以下用法不能包含cb
      // * use(uri, fn)
      .clear()
      .use(uri, fn)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      // * use(uri, fn1, fn2, ..., fnn)
      .clear()
      .use(uri, handle1, fn)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(uri, [fn1, fn2, ..,fnn])
      .clear()
      .use(uri, fns)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(uri, router)
      .clear()
      .use(uri, router)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(uri, obj)
      .clear()
      .use(uri, {
        request: fn
      })
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
      .clear()
      .use(uri, {
        handle: fn
      })
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(uri, fn)
      .clear()
      .use(uri, fn)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use(fn1, fn2, ..., fnn)
      .clear()
      .use(handle1, fn)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })

      // * use([fn1, fn2, ..,fnn])
      .clear()
      .use(fns)
      .get(uri, function (err, doc) {
        expect(doc.ret).toBeTruthy()
      })
  })

  test('promise', done => {
    o
      .clear()
      .use(handle)
      .request('/')
      .then(doc => {
        console.log(doc)
        expect(doc.ret).toBeTruthy()
        done()
      })
      .catch(e => {
        console.error(e)
      })
  })

  test('err', () => {
    o.clear()
    o.use(handle2)
    o.add('/', handle)
    o.request('/', cb)
  })

  test('err promise', done => {
    o.clear()
    o.use(handle2)
    o.add('/', handle)
    o.request('/')
      .then(doc => {
        console.log(doc)
        done()
      })
      .catch(e => {
        console.error(e)
        done()
      })
  })
})
