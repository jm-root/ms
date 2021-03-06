const { client } = require('../lib')

const uri = 'ws://gateway.test.jamma.cn'
const pingTimeout = 1000
const pongTimeout = 1000

let $ = null
beforeAll(async () => {
  $ = await client({ uri, pingTimeout, pongTimeout })
})

afterAll(async () => {
  $.close()
})

describe('ms-client', async () => {
  test('request', async () => {
    let doc = await $.request('/config')
    expect(doc).toBeTruthy()
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
