if (typeof module !== 'undefined' && module.exports) {
  require('../lib')
  Promise = require('bluebird')
}

(function () {
  var ms = jm.ms
  var logger = console
  var utils = jm.utils
  var app = ms()

  var log = function (err, doc) {
    if (err) {
      logger.error(err.stack)
    }
    if (doc) {
      logger.info('%s', utils.formatJSON(doc))
    }
  }

  var root = ms()
  var router = ms()
  root.use('/modules', router)
  router.add('/', 'get', function (opts, cb) {
    cb(null, {ret: true})
  })

  root.get('/modules', log)
})()