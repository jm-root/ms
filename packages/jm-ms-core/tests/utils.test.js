const { isEqual } = require('lodash')
const utils = require('../lib/utils')

const $ = utils

describe('utils', () => {
  test('getUriProtocol', () => {
    expect($.getUriProtocol('http://127.0.0.1/abc') === 'http').toBeTruthy()
  })
  test('getUriPath', () => {
    expect($.getUriPath('http://127.0.0.1/abc') === '/abc').toBeTruthy()
    expect($.getUriPath('http://127.0.0.1/abc/index.html') === '/abc/index.html').toBeTruthy()
    expect($.getUriPath('http://127.0.0.1/abc/index.html#abc') === '/abc/index.html').toBeTruthy()
    expect($.getUriPath('http://127.0.0.1/abc/index.html?a=1&b=2') === '/abc/index.html').toBeTruthy()
    expect($.getUriPath('http://127.0.0.1/abc/index.html#abc?a=1&b=2') === '/abc/index.html').toBeTruthy()
  })
  test('enableType', async () => {
    let o = null
    let doc = null
    const request = () => {
      return 1
    }
    o = { request }
    $.enableType(o, 'get')
    doc = await o.get()
    expect(doc === 1).toBeTruthy()

    o = { request }
    $.enableType(o, ['get', 'post'])
    doc = await o.post()
    expect(doc === 1).toBeTruthy()
  })
  test('uniteParams', () => {
    const uri = '/test'
    const type = 'get'
    const fn = opts => opts
    const fn1 = opts => opts

    function check (obj1, obj2) {
      const ret = isEqual(obj1, obj2)
      if (!ret) {
        console.dir(obj1, obj2)
      }
      return ret
    }

    const pre = $.uniteParams

    // ({uri:uri, type:type, fn:fn})
    // ({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
    // ({uri:uri, fn:fn})
    // ({uri:uri, fn:[fn1, fn2, ..., fnn]})
    // ({type:type, fn:fn})
    // ({type:type, fn:[fn1, fn2, ..., fnn]})
    // ({fn:fn})
    // ({fn:[fn1, fn2, ..., fnn]})
    expect(check(pre({ uri, type, fn }), { uri, type, fn })).toBeTruthy()
    expect(check(pre({ uri, type, fn: [fn, fn1] }), { uri, type, fn: [fn, fn1] })).toBeTruthy()
    expect(check(pre({ uri, fn }), { uri, fn })).toBeTruthy()
    expect(check(pre({ type, fn }), { type, fn })).toBeTruthy()
    expect(check(pre({ fn }), { fn })).toBeTruthy()

    // (uri, type, fn)
    // (uri, type, fn1, fn2, ..., fnn)
    // (uri, type, [fn1, fn2, ..,fnn])
    // (uri, fn)
    // (uri, fn1, fn2, ..., fnn)
    // (uri, [fn1, fn2, ..,fnn])
    // (fn)
    // (fn1, fn2, ..., fnn)
    // ([fn1, fn2, ..,fnn])
    expect(check(pre(uri, type, fn), { uri, type, fn })).toBeTruthy()
    expect(check(pre(uri, type, fn, fn1), { uri, type, fn: [fn, fn1] })).toBeTruthy()
    expect(check(pre(uri, type, [fn, fn1]), { uri, type, fn: [fn, fn1] })).toBeTruthy()
    expect(check(pre(uri, fn), { uri, fn })).toBeTruthy()
    expect(check(pre(fn), { fn })).toBeTruthy()

    expect(check(pre(fn, [fn1]), { fn: [fn, fn1] })).toBeTruthy()
    expect(check(pre([fn, [fn1]]), { fn: [fn, fn1] })).toBeTruthy()

    // (object)
    const obj = {}
    const obj1 = { name: 'obj1' }
    expect(check(pre(obj), { fn: obj })).toBeTruthy()
    expect(check(pre(obj, obj1), { fn: [obj, obj1] })).toBeTruthy()
  })
  test('preRequest', () => {
    const v = ['uri', 'type', 'data', 'params', 'timeout']
    const uri = '/test'
    const type = 'get'
    const data = {
      name: 'jeff',
      age: 18
    }
    const params = {
      token: 'asdfasdjfk'
    }
    const timeout = 1000
    const opts = {
      uri,
      type,
      data,
      params,
      timeout
    }
    const check = (obj1, obj2) => {
      for (const key of v) {
        if (obj1[key] !== obj2[key]) {
          console.log('obj1: %s !== obj2: %s', obj1, obj2)
          return false
        }
      }
      return true
    }
    const pre = $.preRequest

    // request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
    expect(check(pre(opts), opts)).toBeTruthy()

    // request(uri, type, data, {params, timeout})
    expect(check(pre(uri, type, data, { params, timeout }), opts)).toBeTruthy()

    // request(uri, type, data)
    expect(check(pre(uri, type, data), {
      uri,
      type,
      data
    })).toBeTruthy()

    // request(uri, type)
    expect(check(pre(uri, type), {
      uri,
      type
    })).toBeTruthy()

    // request(uri)
    expect(check(pre(uri), {
      uri
    })).toBeTruthy()

    // request(uri, data)
    expect(check(pre(uri, data), {
      uri,
      data
    })).toBeTruthy()

    // request(uri, data)
    expect(check(pre(uri, data, { params, timeout }), {
      uri,
      data,
      params,
      timeout
    })).toBeTruthy()
  })
})
