const log = require('jm-log4js')
const MS = require('jm-ms')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

let logger = log.getLogger('server')
let ms = new MS()

module.exports = function (app) {
  let appWeb = null
  let server = null

  /**
   * 启动服务器
   * @method server#start
   * 成功响应:
   * doc: 结果true成功 false失败
   * 错误响应:
   * doc: {
     *  err: 错误码,
     *  msg: 错误信息
     * }
   */
  app.open = async function (opts = {}) {
    this.emit('beforeOpen', opts)
    let self = this
    let config = this.config
    let root = this.root
    let servers = this.servers
    root.config = config

    // 启动web模块
    appWeb = express()
    let port = config.port || 3000
    let host = config.host || '0.0.0.0'
    server = http.createServer(appWeb).listen(port, host, function () {
      logger.info('ms server listening on %s:%s ', host, server.address().port)
    })
    if (config.max_body_size) {
      appWeb.use(bodyParser.json({ limit: config.max_body_size }))
      appWeb.use(bodyParser.urlencoded({ limit: config.max_body_size, extended: true }))
    } else {
      appWeb.use(bodyParser.json())
      appWeb.use(bodyParser.urlencoded({ extended: true }))
    }
    let trustProxy = false
    config.trust_proxy && (trustProxy = true)
    appWeb.set('trust proxy', trustProxy) // 支持代理后面获取用户真实ip

    // 设置跨域访问
    appWeb.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Forwarded-For, X-Requested-With, Content-Type, Content-Length, Authorization, Accept')
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, HEAD')
      res.header('Content-Type', 'application/json;charset=utf-8')
      if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        res.status(200).end()
      } else if (req.url.indexOf('/favicon.ico') >= 0) {
        res.status(404).end()
      } else {
        next()
      }
    })

    // 启动ms服务器
    let configMS = config.ms || [
      {
        type: 'ws'
      },
      {
        type: 'http'
      }
    ]
    for (let i in configMS) {
      let opts = configMS[i]
      opts.server = server
      opts.app = appWeb
      let doc = await ms.server(root, opts)
      logger.info('ms server type:%s started', opts.type)
      servers[opts.type] = doc
      doc.on('connection', function (session) {
        self.emit('connection', session)
      })
    }

    let router = express.Router()
    servers.http.middle = router
    if (app.config.debug) {
      router.use(function (req, res, next) {
        logger.debug('%s %s params: %j query: %j body: %j headers: %j', req.method, req.url, req.params, req.query, req.body, req.headers)
        next()
      })
    }
    if (app.config.lng) {
      router.use(function (req, res, next) {
        req.lng = app.config.lng
        next()
      })
    }

    router.use(this.httpProxyRouter)

    this.emit('open', opts)
    return true
  }

  /**
   * 停止服务器
   * @method server#stop
   * 成功响应:
   * doc: 结果true成功 false失败
   * 错误响应:
   * doc: {
     *  err: 错误码,
     *  msg: 错误信息
     * }
   */
  app.close = async function (opts) {
    this.emit('beforeClose', opts)
    if (server) {
      server.close()
      server = null
      appWeb = null
    }
    this.emit('close', opts)
    return true
  }
}
