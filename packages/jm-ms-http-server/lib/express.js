const http = require('http')
const https = require('https')
const express = require('express')
const error = require('jm-err')
const log = require('jm-log4js')
const { splitAndTrim } = require('jm-utils')

const Err = error.Err
const logger = log.getLogger('ms-http-server')
const defaultPort = 80

function createApp (opts = {}) {
  const { type, host = null, port = defaultPort } = opts
  const app = express()
  if (type === 'https') {
    https.createServer(opts, app).listen(port, host)
  } else {
    http.createServer(app).listen(port, host)
  }
  return app
}

module.exports = function (router, opts = {}) {
  const { config: { debug } = {} } = router
  debug && (logger.setLevel('debug'))
  let { app } = opts
  if (!app) {
    app = createApp(opts)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.set('trust proxy', true) // 支持代理后面获取用户真实ip

    // 设置跨域访问
    app.use(function (req, res, next) {
      const { headers = {} } = opts
      res.header('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin'] || '*')
      res.header('Access-Control-Allow-Headers', headers['Access-Control-Allow-Headers'] || 'X-Forwarded-For, X-Requested-With, Content-Type, Content-Length, Authorization, Accept')
      res.header('Access-Control-Allow-Methods', headers['Access-Control-Allow-Methods'] || 'PUT, POST, GET, DELETE, OPTIONS, HEAD')
      res.header('Content-Type', headers['Content-Type'] || 'application/json;charset=utf-8')
      if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        res.status(200).end()
      } else if (req.url.indexOf('/favicon.ico') >= 0) {
        res.status(404).end()
      } else {
        next()
      }
    })
  }

  app.use(function (req, res, next) {
    if (app.middle) {
      return app.middle(req, res, next)
    }
    next()
  })

  app.use(function (req, res) {
    const data = Object.assign({}, req.query, req.body)
    const headers = { ...req.headers }
    let { ip, ips } = req
    if (headers['x-original-forwarded-for'] && app.get('trust proxy')) {
      const _ips = splitAndTrim(headers['x-original-forwarded-for'])
      delete headers['x-original-forwarded-for']
      ips = [..._ips, ...ips]
      ips.length && (ip = ips[0])
    }
    const opts = {
      uri: req.path,
      type: req.method.toLowerCase(),
      data,
      protocol: req.protocol,
      hostname: req.hostname,
      headers,
      ip,
      ips
    }
    if (req.headers.lng) opts.lng = req.headers.lng
    router.request(opts)
      .then(doc => {
        if (debug) {
          logger.debug(`ok. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(doc, null, 2)}`)
        }
        if (typeof doc === 'string') {
          res.type('html')
        }
        res.send(doc)
      })
      .catch(err => {
        if (debug) {
          logger.debug(`fail. request:\n${JSON.stringify(opts, null, 2)}\nresponse:\n${JSON.stringify(err.data, null, 2)}`)
        }
        logger.error(err)
        const doc = err.data || Object.assign({}, Err.FA_INTERNALERROR, { status: err.status, msg: err.message })
        return res.status(err.status || doc.status || Err.FA_INTERNALERROR.err).send(doc)
      })
  })

  return app
}
