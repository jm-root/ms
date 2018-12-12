const MS = require('jm-ms')
const ms = new MS()

describe('ms', async () => {
  test('http-client', async () => {
    const uri = 'http://localhost:3000'
    let client = await ms.client({ uri })
    let doc = await client.get('/example')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('ws-client', async () => {
    const uri = 'ws://localhost:3000'
    let client = await ms.client({ uri })
    let doc = await client.get('/example')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
