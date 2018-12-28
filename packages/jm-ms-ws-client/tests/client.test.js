const mdl = require('../lib')
const MS = require('jm-ms-core')

const ms = new MS()
ms.use(mdl)

const uri = 'ws://gateway.test.jamma.cn'
const pingTimeout = 1000
const pongTimeout = 1000

let $ = null
beforeAll(async () => {
  $ = await ms.client({ uri, pingTimeout, pongTimeout })
})

afterAll(async () => {
  $.close()
})

describe('ms-client', async () => {
  test('request', async (done) => {
    let doc = await $.request('/config')
    expect(doc).toBeTruthy()
    setTimeout(() => {
      done()
    }, 3000)
  })

  test('request timeout', async () => {
    try {
      await $.request('/config', {}, { timeout: 1 })
    } catch (e) {
      console.error(e)
      expect(e).toBeTruthy()
    }
  })
})
