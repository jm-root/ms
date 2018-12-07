const mdl = require('../lib')
const MS = require('jm-ms-core')

const server = mdl.server
const ms = new MS()
const router = ms.router()
router.use(opts => {
  return opts
})

describe('server', async () => {
  test('server', async () => {
    let doc = await server(router)
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('module', async () => {
    ms.use(mdl)
    let doc = await ms.server(router, { type: 'http', port: 81 })
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
