const error = require('jm-err')
const wrapper = require('jm-ms-wrapper')
const MS = require('jm-ms')
const ms = new MS()

let $ = {
  router () {
    const router = ms.router()
    wrapper()(router)
    router
      .use(opts => {
        opts.time = Date.now()
      })
      .add('/', opts => {
        return opts
      })
      .add('/err', opts => {
        throw error.err(error.Err.FAIL)
      })
    return router
  }
}

module.exports = opts => {
  return $
}
