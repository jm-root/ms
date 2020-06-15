const Route = require('../lib')

const fn = async (opts) => {
  return new Promise(resolve => {
    setTimeout(() => {
      opts.name = 'jeff'
      resolve(opts)
    }, 1000)
  })
}

describe('simple async', async () => {
  test('one function', async () => {
    const o = new Route(fn)
    const doc = await o.execute({})
    console.log(doc)
    expect(doc.name === 'jeff').toBeTruthy()
  })
})
