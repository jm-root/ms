module.exports = function (adapter) {
  let $ = function (name = 'ms-ws-server') {
    let app = this
    app.serverModules.ws = adapter
    app.serverModules.wss = adapter

    return {
      name: name,
      unuse: () => {
        delete app.serverModules.ws
        delete app.serverModules.wss
      }
    }
  }

  $.server = adapter
  return $
}
