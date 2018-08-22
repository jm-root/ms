const MS = require('jm-ms-core')

class $ extends MS {
  constructor (opts) {
    super(opts)
    this
      .use(require('jm-ms-http-client/lib/browser'))
      .use(require('jm-ms-ws-client/lib/browser'))
  }
}

module.exports = $
