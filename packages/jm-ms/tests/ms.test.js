const MS = require('../lib')

const ms = new MS()
const router = ms.router()
router.use(opts => {
  return opts
})

describe('server', async () => {
  test('server', async () => {
    let doc = await ms.server(router, {type: 'http'})
    console.log(doc)
    expect(doc).toBeTruthy()
  })
})
