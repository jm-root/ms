import client from './client'
import server from './server'

let moduleClient = function (name = 'ms-http-client') {
  let app = this
  app.clientModules.http = client
  app.clientModules.https = client

  return {
    name: name,
    unuse: () => {
      delete app.clientModules.http
    }
  }
}

let moduleServer = function (name = 'ms-http-server') {
  let app = this
  app.serverModules.http = server
  app.serverModules.https = server

  return {
    name: name,
    unuse: () => {
      delete app.serverModules.http
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
