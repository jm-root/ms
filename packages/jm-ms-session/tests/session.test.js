const Session = require('../lib')
const { Err } = require('jm-err')

class MySession extends Session {
  send (message) {
    this.emit('message', message)
  }
}

const $ = new MySession({
  debug: true
})

$.router.route()
  .use('/timeout', async opts => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(opts)
      }, 100)
    })
  })
  .use(opts => {
    return opts
  })

describe('session', async () => {
  test('request', async () => {
    const doc = await $.request('/')
    expect(doc).toBeTruthy()
  })

  test('notify', async () => {
    await $.notify('/')
  })

  test('request timeout', async () => {
    let err = null
    try {
      await $.request('/timeout', {}, { timeout: 1 })
    } catch (e) {
      console.error(e)
      e.data && (err = e.data.err === Err.FA_TIMEOUT.err)
    }
    expect(err).toBeTruthy()
  })
})
