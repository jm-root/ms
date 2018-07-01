if (typeof module !== 'undefined' && module.exports) {
  require('jm-err')
  require('jm-utils')
  require('../lib')
  Promise = require('bluebird')
}

(function () {
  var ms = jm.ms
  var logger = console
  var utils = jm.utils
  var app = jm.ms()

  var log = function (err, doc) {
    if (err) {
      logger.error(err.stack)
    }
    if (doc) {
      logger.info('%s', utils.formatJSON(doc))
    }
  }

  var fn = function (opts, cb, next) {
    logger.info('fn called. %s', utils.formatJSON(opts))
    next()
  }

  var fn2 = function (opts, cb, next) {
    logger.info('fn2 called. %s', utils.formatJSON(opts))
    cb(null, {ret: true})
  }

  //app.use({fn: fn}); //或者app.use({uri:'/', fn: fn});
  app.add('/users/:id', fn, fn2)
  //app.add('/users/:id', [fn, fn2]);
  //app.add('/users/:id', 'get', fn, fn2);
  //app.add('/users/:id', 'get', [fn, fn2]);

  //app.request('/users/123', 'get', {test: true}, 1, log);
  app.get('/users/123', {data: 1}, {parm: 2}, log)

})()