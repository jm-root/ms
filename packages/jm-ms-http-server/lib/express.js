const _ = require('lodash')
const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const error = require('jm-err')
const log = require('jm-log4js')

const logger = log.getLogger('ms-http-server')
const defaultPort = 80

let createApp = function (opts = {}) {
  let host = opts.host || null
  let port = opts.port || defaultPort
  let app = express()
  if (opts.type === 'https') {
    https.createServer(opts, app).listen(port, host)
  } else {
    http.createServer(app).listen(port, host)
  }
  return app
}

let server = async function (router, opts = {}) {
  let config = router.config
  let app = opts.app
  if (!app) {
    app = createApp(opts)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.set('trust proxy', true) // 支持代理后面获取用户真实ip

    // 设置跨域访问
    app.use(function (req, res, next) {
      let headers = opts.headers || {}
      res.header('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin'] || '*')
      res.header('Access-Control-Allow-Headers', headers['Access-Control-Allow-Headers'] || 'X-Forwarded-For, X-Requested-With, Content-Type, Content-Length, Authorization, Accept')
      res.header('Access-Control-Allow-Methods', headers['Access-Control-Allow-Methods'] || 'PUT, POST, GET, DELETE, OPTIONS')
      res.header('Content-Type', headers['Content-Type'] || 'application/json;charset=utf-8')
      if (req.method === 'OPTIONS') { res.sendStatus(200) } else { next() }
    })
  }

  app.use(function (req, res, next) {
    if (app.middle) {
      return app.middle(req, res, next)
    }
    next()
  })

  app.use(function (req, res) {
    _.defaults(req.query, req.body)
    let opts = {
      uri: req.path,
      type: req.method.toLowerCase(),
      data: req.query,
      protocol: req.protocol,
      hostname: req.hostname,
      headers: req.headers,
      ip: req.ip,
      ips: req.ips
    }
    if (req.headers.lng) opts.lng = req.headers.lng
    router.request(opts)
      .then(doc => {
        if (config && config.debug) {
          logger.debug(`ok. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(doc, null, 2)}`)
        }
        if (typeof doc === 'string') {
          res.type('html')
        }
        res.send(doc)
      })
      .catch(err => {
        let doc = err.data
        if (!doc) {
          doc = err.message
        }
        if (config && config.debug) {
          logger.debug(`fail. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(err.data, null, 2)}\n${err.stack || JSON.stringify(err, null, 2)}`)
        }
        return res.status(err.status || error.Err.FA_INTERNALERROR.err).send(doc)
      })
  })

  return app
}

module.exports = server
