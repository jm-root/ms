const Router = require('../lib/router')

const handle1 = (opts) => { opts.handle1 = true }

const handle2 = () => {
  throw new Error('err handle')
}

const handle = (opts) => {
  return { ...opts }
}

const o = new Router({
  sensitive: true,
  strict: true,
  logging: true,
  benchmark: true
})
o.on('add', (...args) => { console.log('add', ...args) })

const o2 = new Router()
o2
  .add('/:id', (opts) => {
    return { ...opts }
  })

let doc = null
describe('router', () => {
  test('_add', async () => {
    o
      .clear()
      .use(handle1, o2)
      ._add({
        type: 'get',
        fn: [{ request: handle }]
      })

    doc = await o.get('/')
    expect(doc.handle1).toBeTruthy()

    doc = await o.get('/abc')
    expect(doc.handle1 && doc.params.id === 'abc').toBeTruthy()
  })

  test('use vs add', () => {
    o
      .clear()
      .use(handle)
      .get('/t1')
      .then(doc => {
        expect(doc).toBeTruthy()
      })

    o
      .clear()
      .add(handle)
      .get('/t1')
      .then(doc => {
        expect(doc === undefined).toBeTruthy()
      })
  })

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

  test('error', async () => {
    o
      .clear()
      // * add({uri:uri, type:type, fn:fn})
      .add({
        uri: '/t1',
        type: 'get',
        fn: () => { throw new Error('request err') }
      })

    o.on('error', (e) => {
      e.message = 'asdfsdfsd'
    })
    try {
      await o.request('/t1', 'get')
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })

  test('use', () => {
    const uri = '/test'
    const fn = handle
    const fns = [handle1, handle]
    const router = new Router()
    router.use(fn)
    o
    // * use({uri:uri, fn:fn})
      .clear()
      .use({ uri: uri, fn: fn })
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
      .use({ uri: uri, fn: fns })
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
      .use({ uri: uri, fn: router })
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
      .request('/abc/name', {}, { params: { id: 12663 }, headers: { sso: '123' } })
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
      .request('/abc/name', {}, { params: { id: 12663 }, headers: { sso: '123' } })
      .then(doc => {
        console.log(doc)
      })
      .catch(e => {
        console.error(e)
      })
  })

  test('emit err', async () => {
    o
      .off()
      .on('error', () => {
        console.log('not cached.')
      })
      .on('error', (e) => {
        console.log('cached.')
        return e.data || null
      })
      .clear()
      .use(handle2)
      .request('/abc/name', {}, { params: { id: 12663 }, headers: { sso: '123' } })
      .then(doc => {
        expect(doc === null).toBeTruthy()
      })
  })

  test('quick route', () => {
    o
      .clear()
      .route('/abc')
      .get({
        uri: '/t1',
        fn: handle
      })

    console.log(o.routes)

    o
      .get('/abc/t1')
      .then(doc => {
        expect(doc).toBeTruthy()
      })
      .catch(e => {
        console.log(e)
      })
  })
})
