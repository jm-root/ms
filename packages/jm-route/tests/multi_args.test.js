const Route = require('../lib')

let fn = (opts, age) => {
  opts.name = 'jeff'
  opts.age = age
  return opts
}

let fnFilter = (opts) => {
  opts.sex = 1
}

describe('multi args', async () => {
  test('one function', async () => {
    let o = new Route(fn)
    let doc = await o.execute({}, 18)
    console.log(doc)
    expect(doc.name === 'jeff' && doc.age === 18).toBeTruthy()
  })

  test('chain', async () => {
    let o = new Route([fnFilter, fn])
    let doc = await o.execute({}, 18)
    console.log(doc)
    expect(doc.sex === 1 && doc.name === 'jeff' && doc.age === 18).toBeTruthy()
  })
})
