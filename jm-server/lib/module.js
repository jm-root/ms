const MS = require('jm-ms-core')

let ms = new MS()

module.exports = function (app) {
  let router = ms.router()
  router.add('/', 'get', function (opts, cb, next) {
    cb(null, app.moduleConfigs)
  })
  router.add('/:name', 'delete', function (opts, cb, next) {
    app.unuse(opts.params.name)
    cb(null, {ret: true})
  })
  app.router.use('/modules', router)
}
