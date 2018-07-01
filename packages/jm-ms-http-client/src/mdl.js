export default function (client) {
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

  if (typeof global !== 'undefined' && global) {
    global.jm || (global.jm = {})
    let jm = global.jm
    if (jm.ms) {
      jm.ms.root.use($)
    }
  }

  return $
}
