const utils = require('../src/utils')

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
    let request = opts => {
      return 1
    }
    o = {request}
    $.enableType(o, 'get')
    doc = await o.get()
    expect(doc === 1).toBeTruthy()

    o = {request}
    $.enableType(o, ['get', 'post'])
    doc = await o.post()
    expect(doc === 1).toBeTruthy()

  })
  test('preRequest', () => {
    let v = ['uri', 'type', 'data', 'params', 'timeout']
    let uri = '/test'
    let type = 'get'
    let data = {
      name: 'jeff',
      age: 18
    }
    let params = {
      token: 'asdfasdjfk'
    }
    let timeout = 1000
    let opts = {
      uri,
      type,
      data,
      params,
      timeout
    }
    let check = (obj1, obj2) => {
      for (let key of v) {
        if (obj1[key] !== obj2[key]) {
          console.log('obj1: %s !== obj2: %s', obj1, obj2)
          return false
        }
      }
      return true
    }
    let pre = $.preRequest

    // request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
    expect(check(pre(opts), opts)).toBeTruthy()

    // request(uri, type, data, {params, timeout})
    expect(check(pre(uri, type, data, {params, timeout}), opts)).toBeTruthy()

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
    expect(check(pre(uri, data, {params, timeout}), {
      uri,
      data,
      params,
      timeout
    })).toBeTruthy()

  })
})
