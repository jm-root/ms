const mdl = require('../lib')
const MS = require('jm-ms-core')

const ms = new MS()
const client = mdl.client
const uri = 'ws://gateway.test.jamma.cn'

describe('client', async () => {
  test('client', async () => {
    let $ = await client({uri})
    await $.onReady()
    let doc = await $.request('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    let $ = await ms.client({uri})
    await $.onReady()
    let doc = await $.request('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
