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
  var app = ms()

  var log = function (err, doc) {
    if (err) {
      logger.error(err.stack)
    }
    if (doc) {
      logger.info('%s', utils.formatJSON(doc))
    }
  }

  var done = function (resolve, reject, err, doc) {
    log(err, doc)
    if (err) {
      reject(err, doc)
    } else {
      resolve(doc)
    }
  }

  var add = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.info('add %s', utils.formatJSON(opts))
      app.add(opts, function (err, doc) {
        log(err, doc)
        resolve(doc)
      })
    })
  }

  var use = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.info('use %s', utils.formatJSON(opts))
      var o = {
        _request: function (opts, cb) {
          logger.info('o %s', utils.formatJSON(opts))
          cb(null, {o: 123})
        },

        handle: function (opts, cb, next) {
          logger.info('o %s', utils.formatJSON(opts))
          next()
        }
      }
      app.use({uri: '/users/:id', fn: o})

      var router = ms()
      router.use(opts)
      app.use({uri: '/users', fn: router})
      resolve({})
    })
  }

  var request = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.info('request %s', utils.formatJSON(opts))
      app.request(opts, function (err, doc) {
        log(err, doc)
        resolve(doc)
      })
    })
  }

  var notify = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.info('notify %s', utils.formatJSON(opts))
      app.request(opts)
      resolve({})
    })
  }

  var fn = function (opts, cb, next) {
    logger.info('fn called. %s', utils.formatJSON(opts))
    opts.step = opts.step || 0
    opts.step++
    next()
  }

  var opts = {
    uri: '/users/*',
    fn: [fn, fn],
    request: {
      uri: '/users/123',
      data: {
        test: true
      }
    }
  }

  var opts1 = {
    uri: '/:id',
    fn: function (opts, cb) {
      logger.info('fn called 2. %s', utils.formatJSON(opts))
      cb(null, opts.data)
    }
  }
  add(opts)
  //.then(function(doc){
  //    return add(opts);
  //})
    .then(function (doc) {
      return use(opts1)
    })
    .then(function (doc) {
      return request(opts.request)
    })
    .then(function (doc) {
      return notify(opts.request)
    })
    .catch(SyntaxError, function (e) {
      logger.error(e.stack)
    })
    .catch(function (e) {
      logger.error(e.stack)
    })

})()