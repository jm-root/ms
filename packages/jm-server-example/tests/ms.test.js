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

    // 测试消息订阅于发布
    await client.post('/message/subscribe', { channel: 'test' })
    client.on('message', opts => {
      console.log('message received', opts)
    })
    await client.post('/message/publish', { channel: 'test', msg: { abc: 1233, userId2: '12255552' } })
  })
})
