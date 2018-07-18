const fnclient = require('./fnclient')

module.exports = function (Adapter) {
  let client = fnclient(Adapter)
  let $ = function (name = 'ms-ws-client') {
    let app = this
    app.clientModules.ws = client
    app.clientModules.wss = client

    return {
      name: name,
      unuse: () => {
        delete app.clientModules.ws
        delete app.clientModules.wss
      }
    }
  }

  $.client = client
  return $
}
