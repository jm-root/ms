const MS = require('jm-ms-core')

class $ extends MS {
  constructor (opts) {
    super(opts)
    this
      .use(require('jm-ms-http-client'))
      .use(require('jm-ms-ws-client'))
  }
}

module.exports = $
