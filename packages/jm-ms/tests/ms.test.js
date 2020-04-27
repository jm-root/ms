const log = require('jm-log4js')
log.getLogger('ms-ws-server').level = 'debug'
log.getLogger('ms-http-server').level = 'debug'

const MS = require('../lib')

const ms = new MS()
const router = ms.router()
router.config = { debug: true }
router.use(opts => {
  return opts
})

const uri = 'http://gateway.test.jamma.cn'
describe('ms', async () => {
  test('server', async () => {
    let doc = ms.server(router, { type: 'ws', port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('http-client', async () => {
    let client = ms.client({ uri })
    let doc = await client.get('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('proxy', async () => {
    router.clear()
    router.proxy('/config', uri)
    let doc = await router.get('/config')
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
