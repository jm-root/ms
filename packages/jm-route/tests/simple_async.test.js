const Route = require('../lib')

let fn = async (opts) => {
  return new Promise(resolve => {
    setTimeout(() => {
      opts.name = 'jeff'
      resolve(opts)
    }, 1000)
  })
}

describe('simple async', async () => {
  test('one function', async () => {
    let o = new Route(fn)
    let doc = await o.execute({})
    console.log(doc)
    expect(doc.name === 'jeff').toBeTruthy()
  })
})
