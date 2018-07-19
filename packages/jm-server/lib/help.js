const helper = require('jm-ms-help')
const MS = require('jm-ms-core')

let ms = new MS()

module.exports = function (app) {
  let router = ms.router()
  let modules = app.modules
  router.add('/', 'get', function (opts) {
    opts.help || (opts.help = {})
    let _modules = {}
    let status = 1
    for (let key in modules) {
      let module = modules[key]
      _modules[key] = 1
      if (!module || module.ready === undefined) continue
      if (!module.ready) {
        _modules[key] = 0
        status = 0
      }
    }
    opts.help.status = status
    opts.help.modules = _modules
  })
  helper.enableHelp(router, require('../package.json'))
  app.router.use(router)
}
