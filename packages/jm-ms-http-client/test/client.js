import chai from 'chai'

let expect = chai.expect
import client from '../src/client'

describe('client', function () {
  it('client', function (done) {
    client({
      uri: 'http://api.jamma.cn'
    }, function (err, c) {
      c.request('/', function (err, doc) {
        expect(doc).to.be.an('object')
        c.request('/')
          .then(doc => {
            expect(doc).to.be.an('object')
            done()
          })
          .catch(e => {
            console.log(e)
            done()
          })
      })
    })
  })
})
