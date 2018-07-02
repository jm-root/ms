let mdl = require('../src')
let client = mdl.client
let MS = require('jm-ms-core')
let ms = new MS()

describe('client', () => {
  test('client', async () => {
    let $ = await client({uri: 'http://gateway.test.jamma.cn'})
    await $.onReady()
    let doc = await $.request('/acl')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('client with adapter', async () => {
    let adapter = {
      async request (url, data, opts) {
        return {data: data}
      }
    }
    let $ = await client({uri: 'http://gateway.test.jamma.cn', adapter})
    await $.onReady()
    let doc = await $.request('/acl', {name: 'jeff'})
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    let $ = await ms.client({uri: 'http://gateway.test.jamma.cn'})
    await $.onReady()
    let doc = await $.request('/acl')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
