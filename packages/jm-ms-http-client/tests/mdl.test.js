const mdl = require('../lib')
const MS = require('jm-ms-core')

const client = mdl.client
const ms = new MS()
const uri = 'http://gateway.test.jamma.cn'
describe('client', async () => {
  test('client', async () => {
    let $ = await client(uri)
    await $.onReady()
    let doc = await $.request('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('client with adapter', async () => {
    let adapter = {
      async request (url, data, opts) {
        return { data: data }
      }
    }
    let $ = await client({ uri, adapter })
    await $.onReady()
    let doc = await $.request('/config', { name: 'jeff' })
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    let $ = await ms.client({ uri })
    await $.onReady()
    let doc = await $.request('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
