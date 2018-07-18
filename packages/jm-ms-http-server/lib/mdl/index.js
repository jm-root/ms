module.exports = function (adapter) {
  let $ = function (name = 'ms-http-server') {
    let app = this
    app.serverModules.http = adapter
    app.serverModules.https = adapter

    return {
      name: name,
      unuse: () => {
        delete app.serverModules.http
        delete app.serverModules.https
      }
    }
  }

  $.server = adapter
  return $
}
