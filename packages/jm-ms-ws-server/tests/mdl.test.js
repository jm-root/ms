const mdl = require('../lib')
const MS = require('jm-ms-core')

const server = mdl.server
const ms = new MS()
const router = ms.router()
router.config = { debug: true }
router
  .use('/ping', async opts => {
    const { session } = opts
    return session.request({ uri: '/pong' })
  })
  .use(opts => opts)

describe('server', async () => {
  test('server', async () => {
    const doc = server(router, { port: 3000 })
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    const doc = await ms.server(router, { type: 'ws', port: 3000 })
    expect(doc).toBeTruthy()
  })
})
