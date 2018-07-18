const fnclient = require('./fnclient')

module.exports = function (adapter) {
  let client = fnclient(adapter)
  let $ = function (name = 'ms-http-client') {
    let app = this
    app.clientModules.http = client
    app.clientModules.https = client

    return {
      name: name,
      unuse: () => {
        delete app.clientModules.http
        delete app.clientModules.https
      }
    }
  }

  $.client = client
  return $
}
