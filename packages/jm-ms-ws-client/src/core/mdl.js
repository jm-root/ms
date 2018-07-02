export default function (client) {
  let $ = function (name = 'ms-ws-client') {
    let app = this
    app.clientModules.ws = client

    return {
      name: name,
      unuse: () => {
        delete app.clientModules.ws
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
