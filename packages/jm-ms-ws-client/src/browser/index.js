import client from './client'

let moduleClient = function (name = 'ms-ws-client') {
  let app = this
  app.clientModules.ws = client

  return {
    name: name,
    unuse: () => {
      delete app.clientModules.ws
    }
  }
}

let $ = {
  moduleClient
}

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {})
  let jm = global.jm
  if (jm.ms) {
    for (let key in $) jm.ms.root.use($[key])
  }
}

$.client = client
export default $
