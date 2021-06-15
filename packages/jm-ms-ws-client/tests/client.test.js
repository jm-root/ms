const mdl = require('../lib')
const MS = require('jm-ms-core')

const ms = new MS()
ms.use(mdl)

const uri = 'ws://localhost:3000'
const pingTimeout = 1000
const pongTimeout = 1000

let $ = null
beforeAll(async () => {
  $ = await ms.client({ uri, pingTimeout, pongTimeout, debug: true })

  $.router.use(() => { return { client: 'pong' } })
})

afterAll(async () => {
  $.close()
})

describe('ms-client', async () => {
  test('request', async (done) => {
    const doc = await $.request('/config')
    expect(doc).toBeTruthy()
    setTimeout(done, 3000)
  })

  test('request pingpong', async (done) => {
    const doc = await $.request('/ping')
    console.log('sdddddddddddd', doc)
    expect(doc).toBeTruthy()
    setTimeout(done, 3000)
  })

  test('request timeout', async (done) => {
    try {
      await $.request('/config', {}, { timeout: 1 })
    } catch (e) {
      console.error(e)
    }
    setTimeout(done, 1000)
  })
})
