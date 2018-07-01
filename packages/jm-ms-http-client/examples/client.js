if (typeof module !== 'undefined' && module.exports) {
  require('jm-ms-core')
  require('../lib')
}

(function () {
  var app = jm.ms()

  var log = function (err, doc) {
    if (err) {
      console.log(err)
    }
    if (doc) {
      console.info(doc)
    }
  }

  var opts = {
    uri: '/users/:id',
    type: 'get',
    fn: function (opts, cb) {
      cb(null, opts.data)
    },
    request: {
      uri: '/users/123',
      type: 'get',
      data: {
        test: true
      },
      ips: ['128.0.0.1', '129.0.0.1']
    }
  }

  jm.ms.client({
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
    })
  })
})()
