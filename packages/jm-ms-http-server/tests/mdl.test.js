const mdl = require('../lib')
const MS = require('jm-ms-core')
const log = require('jm-log4js')
const logger = log.getLogger('ms-http-server')
logger.level = 'debug'

const server = mdl.server
const ms = new MS()
const router = ms.router()
router.config = { debug: true }
router.use(opts => {
  return opts
})

describe('server', async () => {
  test('server', async () => {
    let doc = await server(router, { port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    let doc = await ms.server(router, { type: 'http', port: 3000 })
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
