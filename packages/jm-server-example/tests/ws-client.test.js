const MS = require('jm-ms')
const ms = new MS()

describe('ws-client', async () => {
  test('subscribe and publish', async () => {
    const uri = 'ws://localhost:3000'
    const client = await ms.client({ uri })

    // 测试消息订阅于发布
    await client.post('/message/subscribe', { channel: 'test' })
    client.on('message', opts => {
      console.log('message received', opts)
    })
    await client.post('/message/publish', { channel: 'test', msg: { abc: 1233, userId2: '12255552' } })
  })
})
