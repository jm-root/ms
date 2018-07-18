const $ = require('../src/compose')

describe('utils', () => {
  test('compose', async () => {
    function a (opts) {
      opts.a = true
    }

    async function b (opts) {
      opts.b = true
    }

    async function c (opts) {
      return opts
    }

    let fn = $(a, b, c)
    let o = await fn()
    console.log(o)
    expect(o).toBeTruthy()
  })
})
