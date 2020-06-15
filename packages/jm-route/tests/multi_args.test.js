const { isEqual } = require('lodash')
const Route = require('../lib')

const name = 'jeff'
const age = 18
const gender = 1
const fn = (opts, age) => {
  Object.assign(opts, { name, age })
  return opts
}

const fnFilter = (opts) => {
  Object.assign(opts, { gender })
}

describe('multi args', async () => {
  test('one function', async () => {
    const o = new Route(fn)
    const doc = await o.execute({}, age)
    console.log(doc)
    expect(isEqual(doc, { name, age })).toBeTruthy()
  })

  test('chain', async () => {
    const o = new Route([fnFilter, fn])
    const doc = await o.execute({}, age)
    console.log(doc)
    expect(isEqual(doc, { name, age, gender })).toBeTruthy()
  })
})
