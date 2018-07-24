const Router = require('../lib/router')

let handle1 = (opts) => {}

let handle2 = (opts) => {
  throw new Error('err handle')
}

let handle3 = (opts) => {
  return opts
}

let handle = (opts) => {
  return opts
}

let o = new Router({
  sensitive: true,
  strict: true,
  logging: true,
  benchmark: true
})

let o2 = new Router()
o2.add('/:id', (opts) => {
  console.log('o2 %j:', opts)
  return opts
})

describe('router', () => {
  test('add', () => {
    o
      .clear()
      // * add({uri:uri, type:type, fn:fn})
      .add({
        uri: '/t1',
        type: 'get',
        fn: handle
      })
      .get('/t1')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
      .add({
        uri: '/t2',
        type: 'get',
        fn: [handle1, handle]
      })
      .get('/t2')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, fn)
      .add('/t5', handle)
      .get('/t5')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, fn1, fn2, ..., fnn)
      .add('/t6', handle1, handle)
      .get('/t6')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, [fn1, fn2, ..,fnn])
      .add('/t7', [handle1, handle])
      .get('/t7')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, type, fn)
      .add('/t8', 'get', handle)
      .get('/t8')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, type, fn1, fn2, ..., fnn)
      .add('/t9', 'get', handle1, handle)
      .get('/t9')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      // * add(uri, type, [fn1, fn2, ..,fnn])
      .add('/t10', 'get', [handle1, handle])
      .get('/t10')
      .then(doc => {
        expect(doc).toBeTruthy()
      })
  })

  test('notify', async () => {
    o
      .clear()
      // * add({uri:uri, type:type, fn:fn})
      .add({
        uri: '/t1',
        type: 'get',
        fn: handle
      })
      .notify('/t1', 'get')
  })

  test('use', () => {
    let uri = '/test'
    let fn = handle
    let fns = [handle1, handle3]
    let router = new Router()
    router.use(fn)
    o
    // * use({uri:uri, fn:fn})
      .clear()
      .use({uri: uri, fn: fn})
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
      .clear()
      .use({uri: uri, fn: fns})
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use({uri:uri, fn:router})
      .clear()
      .use({uri: uri, fn: router})
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use({uri:uri, fn:obj})
      .clear()
      .use({
        uri: uri,
        fn: {
          request: fn
        }
      })
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
      .clear()
      .use({
        uri: uri,
        fn: {
          execute: fn
        }
      })
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(router)
      .clear()
      .use(router)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(obj) obj必须实现了request或者handle函数之一，优先使用request
    // * use(uri, fn)
      .clear()
      .use(uri, fn)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(uri, fn1, fn2, ..., fnn)
      .clear()
      .use(uri, handle1, fn)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(uri, [fn1, fn2, ..,fnn])
      .clear()
      .use(uri, fns)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(uri, router)
      .clear()
      .use(uri, router)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(uri, obj)
      .clear()
      .use(uri, {
        request: fn
      })
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
      .clear()
      .use(uri, {
        execute: fn
      })
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(uri, fn)
      .clear()
      .use(uri, fn)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })

    o
    // * use(fn1, fn2, ..., fnn)
      .clear()
      .use(handle1, fn)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
    // * use([fn1, fn2, ..,fnn])
      .clear()
      .use(fns)
      .get(uri)
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })
  })

  test('request', async () => {
    o
      .clear()
      .use(handle1)
      .use('/abc', o2)
      .request('/abc/name', {}, {params: {id: 12663}, headers: {sso: '123'}})
      .then(doc => {
        console.log(doc)
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.error(e)
      })
  })

  test('request err', done => {
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

  test('request not found', async () => {
    o
      .clear()
      .use(handle1)
      .request('/abc/name', {}, {params: {id: 12663}, headers: {sso: '123'}})
      .then(doc => {
        console.log(doc)
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.error(e)
      })
  })
})
