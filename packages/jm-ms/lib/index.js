const MS = require('jm-ms-core')

class $ extends MS {
  constructor (opts = {}) {
    super(opts)
    if (!opts.disable_client) {
      this
        .use(require('jm-ms-http-client'))
        .use(require('jm-ms-ws-client'))
    }

    if (!opts.disable_server && typeof process === 'object') {
      this
        .use(require('jm-ms-http-server'))
        .use(require('jm-ms-ws-server'))
    }
  }
}

module.exports = $
