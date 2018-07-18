const Matcher = require('../src/matcher')

describe('matcher', () => {
  test('Matcher', () => {
    let o = new Matcher()
    expect(o).toBeTruthy()
  })

  test('match', () => {
    let o = new Matcher()
    let doc = o.match()
    expect(doc).not.toBeTruthy()
    doc = o.match({uri: '/'})
    expect(doc).toBeTruthy()
    expect(doc.uri === '/' && doc.params).toBeTruthy()
    expect(!o.match({uri: '/abc'})).toBeTruthy()

    o = new Matcher({
      end: false
    })
    expect(o.match()).not.toBeTruthy()
    doc = o.match({uri: ''})
    expect(doc).toBeTruthy()
    expect(doc.uri === '' && doc.params).toBeTruthy()
    doc = o.match({uri: '/'})
    expect(doc).toBeTruthy()
    expect(doc.uri === '' && doc.params).toBeTruthy()
    doc = o.match({uri: '/abc'})
    expect(doc).toBeTruthy()
    expect(doc.uri === '' && doc.params).toBeTruthy()

    o = new Matcher({
      type: 'get'
    })
    doc = o.match({uri: '/', type: 'get'})
    expect(doc).toBeTruthy()
    expect(doc.uri === '/' && doc.params).toBeTruthy()
    doc = o.match({uri: '/abc', type: 'get'})
    expect(doc).not.toBeTruthy()

    o = new Matcher({
      uri: '/:name',
      type: 'get'
    })
    doc = o.match({uri: '/abc', type: 'get'})
    expect(doc).toBeTruthy()
    console.log(doc)
    expect(doc.uri === '/abc' && doc.params.name).toBeTruthy()

  })

})
