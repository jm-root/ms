import client from './client'
import server from './server'

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

let moduleServer = function (name = 'ms-ws-server') {
  let app = this
  app.serverModules.ws = server

  return {
    name: name,
    unuse: () => {
      delete app.serverModules.ws
    }
  }
}

let $ = {
  moduleClient,
  moduleServer
}

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {})
  let jm = global.jm
  if (jm.ms) {
    for (let key in $) jm.ms.root.use($[key])
  }
}

$.client = client
$.server = server

export default $
