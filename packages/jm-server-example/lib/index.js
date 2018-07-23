const MS = require('jm-ms')
const ms = new MS()

let $ = {
  router () {
    const router = ms.router()
    router
      .use(opts => {
        opts.time = Date.now()
      })
      .add('/', opts => {
        return opts
      })
    return router
  }
}

module.exports = opts => {
  return $
}
