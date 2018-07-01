if (typeof module !== 'undefined' && module.exports) {
  require('jm-err')
  require('jm-utils')
  require('../lib')
  Promise = require('bluebird')
}

(function () {
  var ms = jm.ms
  var logger = jm.logger
  var utils = jm.utils
  var app = ms()

  var log = function (err, doc) {
    if (err) {
      logger.error(err.stack)
    }
    if (doc) {
      logger.debug('%s', utils.formatJSON(doc))
    }
  }

  var done = function (resolve, reject, err, doc) {
    //log(err, doc);
    if (err) {
      reject(err, doc)
    } else {
      resolve(doc)
    }
  }

  var fn = function (opts, cb, next) {
    //logger.debug('fn called. %s', utils.formatJSON(opts));
    next()
  }

  var fn2 = function (opts, cb, next) {
    //logger.debug('fn2 called. %s', utils.formatJSON(opts));
    cb(null, {ret: true})
  }

  app.use({fn: fn}) //或者 推荐
  //app.use({uri:'/', fn: fn}); //或者 推荐
  //app.add({                   //用*性能低
  //    uri: '*',
  //    fn: fn
  //});
  app.add({
    uri: '/users/:id',
    fn: fn2
  })

  var count = 100000
  var data = []
  for (var i = 0; i < count; i++) data.push(i)
  var t = Date.now()
  var m = 0
  var request = function () {
    return new Promise(function (resolve, reject) {
      app.request({
        uri: '/users/123',
        data: {
          test: true
        }
      }, function (err, doc) {
        m++
        if (m == count) {
          logger.debug('实际耗时 %j 毫秒', Date.now() - t)
        }
        done(resolve, reject, err, doc)
      })
    })
  }
  Promise.each(data, request).then(function () {
    logger.debug('请求 %j 次, 耗时 %j 毫秒', count, Date.now() - t)
  })

})()