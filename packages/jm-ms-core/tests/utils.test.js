const utils = require('../src/utils')

describe('utils', () => {
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
          console.log('obj1: %s obj2: %s', utils.formatJSON(obj1), utils.formatJSON(obj2))
          return false
        }
      }
      return true
    }
    let pre = utils.preRequest

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
