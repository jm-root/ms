const MS = require('../lib')

const ms = new MS()
const router = ms.router()
router.use(opts => {
  return opts
})

const uri = 'http://gateway.test.jamma.cn'
describe('ms', async () => {
  test('server', async () => {
    let doc = await ms.server(router, {type: 'http', port: 3000})
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('http-client', async () => {
    let client = await ms.client({uri})
    let doc = await client.get('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('proxy', async () => {
    router.clear()
    await router.proxy('/config', uri)
    let doc = await router.get('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
