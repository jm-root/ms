if (typeof module !== 'undefined' && module.exports) {
  require('jm-ms-core')
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
      logger.debug('%s', utils.formatJSON(doc))
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
      logger.debug('add %s', utils.formatJSON(opts))
      app.add(opts, function (err, doc) {
        log(err, doc)
        resolve(doc)
      })

      app.add('/html2', 'get', function (opts, cb) {
        cb(null, '<html><body>html test</body></html>')
      })
    })
  }

  var request = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.debug('request %s', utils.formatJSON(opts))
      app.request(opts, function (err, doc) {
        log(err, doc)
        resolve(doc)
      })
    })
  }

  var testhttp = function (opts) {
    return new Promise(function (resolve, reject) {
      logger.debug('test http')

      // 独立运行
      ms.server(
        app,
        {
          type: 'http',
          port: 3000
        },
        function (err, doc) {
          console.log('Listening on ' + 3000)
          doc.middle = function (req, res, next) {
            logger.debug('this is middle')
            next()
          }
        }
      )

      ms.server(
        app,
        {
          type: 'https',
          port: 3001,
          key: require('fs').readFileSync(__dirname + '/certs/server-key.pem'),
          cert: require('fs').readFileSync(__dirname + '/certs/server.pem')
        },
        function (err, doc) {
          console.log('Listening on ' + 3001)
          doc.middle = function (req, res, next) {
            logger.debug('this is middle')
            next()
          }
        }
      )

      // 跟http和express一起使用
      var appWeb = require('express')()
      var server = require('http').createServer(appWeb)
      appWeb.use('/hello', function (req, res) {
        res.send({msg: 'hello, this is jm-ms-ws.'})
      })
      ms.server(
        app,
        {
          type: 'http',
          app: appWeb
        }
      )

      server.listen(3200, function () {
        console.log('Listening on ' + server.address().port)
      })

      ms.client({
        type: 'http',
        timeout: 1000
      }, function (err, doc) {
        var client = doc
        client.on('open', function () {
          client.get('/users/123', {data: 1}, function (err, doc) {
            log(err, doc)
          })
        })

        client.request(opts.request, function (err, doc) {
          log(err, doc)

          // 性能测试
          // jm.getLogger('jm-ms-http-client:server').setLevel('INFO')
          // jm.getLogger('jm-ms-http-client:client').setLevel('INFO')
          // logger.setLevel('INFO')
          // logger.info('开始性能测试')
          var count = 10
          var data = []
          for (var i = 0; i < count; i++) data.push(i)
          var t = Date.now()
          var request = function () {
            return new Promise(function (resolve, reject) {
              client.request(opts.request, function (err, doc) {
                if (err) {
                  reject(err, doc)
                } else {
                  resolve(doc)
                }
              })
            })
          }
          Promise.each(data, request).then(function () {
            logger.info('请求 %j 次, 耗时 %j 毫秒', count, Date.now() - t)
          })
        })
      })
      resolve(null)
    })
  }

  var opts = {
    uri: '/users/:id',
    type: 'get',
    fn: function (opts, cb) {
      logger.debug('func called. %s', utils.formatJSON(opts))
      cb(null, opts.data)
    },
    request: {
      uri: '/users/123',
      type: 'get',
      lng: 'zh_CN',
      data: {
        test: true
      },
      ips: ['128.0.0.1', '129.0.0.1']
    }
  }

  add(opts)
    .then(function () {
      return request(opts);
    })
    .then(function (doc) {
      return testhttp(opts)
    })
    .catch(SyntaxError, function (e) {
      logger.error(e.stack)
    })
    .catch(function (e) {
      logger.error(e.stack)
    })
})()
