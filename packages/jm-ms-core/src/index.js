import error from 'jm-err'
import event from 'jm-event'
import mdl from 'jm-module'
import utils from './utils'
import Router from './router'
import Err from './err'

/**
 * Class representing a root.
 */
class Root {
  /**
     * create a root
     */
  constructor () {
    error.enableErr(this)
    mdl.enableModule(this)
    this.utils = utils
    this.clientModules = {}
    this.serverModules = {}
  }

  /**
     * create a router
     * @param {Object} opts
     * @return {Router}
     */
  router (opts = {}) {
    let self = this
    let app = new Router(opts)

    /**
         * 添加代理
         * 支持多种参数格式, 例如
         * proxy({uri:uri, target:target, changeOrigin:true}, cb)
         * proxy(uri, target, changeOrigin, cb)
         * proxy(uri, target, cb)
         * 可以没有回调函数cb
         * proxy({uri:uri, target:target, changeOrigin:true})
         * proxy(uri, target, changeOrigin)
         * proxy(uri, target)
         * @param {String} uri
         * @param {String} target
         * @param {boolean} changeOrigin 是否改变原始uri
         * @param {function} cb 回调cb(err,doc)
         */
    app.proxy = function (uri, target, changeOrigin, cb) {
      let opts = uri
      if (typeof uri === 'string') {
        opts = {
          uri: uri,
          target: target
        }
        if (typeof changeOrigin === 'boolean') {
          opts.changeOrigin = changeOrigin
        } else if (changeOrigin && typeof changeOrigin === 'function') {
          cb = changeOrigin
        }
      } else {
        cb = target
      }
      opts || (opts = {})
      cb || (cb = function (err, doc) {
        if (err) throw err
      })
      if (!opts.target) {
        let doc = error.Err.FA_PARAMS
        let err = error.err(doc)
        cb(err, doc)
      }
      this.emit('proxy', opts)
      if (typeof opts.target === 'string') {
        opts.target = {uri: opts.target}
      }
      if (opts.changeOrigin) {
        self.client(opts.target, function (err, client) {
          if (err) return cb(err, client)
          app.use(opts.uri, function (opts, cb) {
            client.request(opts, cb)
          })
          cb(err, client)
        })
      } else {
        self.proxy(opts.target, function (err, doc) {
          if (err) return cb(err, doc)
          app.use(opts.uri, doc)
          cb(err, doc)
        })
      }
    }
    return app
  }

  /**
     * create a client
     * @param {Object} opts
     * @example
     * opts参数:{
     *  type: 类型(可选, 默认http)
     *  uri: uri(可选, 默认http://127.0.0.1)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @param {function} cb 回调cb(err,doc)
     * @return {Root} - for chaining
     */
  client (opts = {}, cb = null) {
    let err = null
    let doc = null
    let type = 'http'
    opts.uri && (type = utils.getUriProtocol(opts.uri))
    opts.type && (type = opts.type)
    type = type.toLowerCase()
    let fn = this.clientModules[type]
    if (!fn) {
      doc = Err.FA_INVALIDTYPE
      err = error.err(doc)
      if (cb) cb(err, doc)
    } else {
      fn(opts, function (err, doc) {
        if (!err) utils.enableType(doc, ['get', 'post', 'put', 'delete'])
        if (cb) cb(err, doc)
      })
    }
    return this
  }

  /**
     * create a server
     * @param {Object} app
     * @param {Object} opts
     * @example
     * opts参数:{
     *  uri: 网址(可选)
     *  type: 类型(可选, 默认http)
     *  host: 主机(可选, 默认127.0.0.1)
     *  port: 端口(可选, 默认80, 根据type不同默认值也不同)
     * }
     * @param {function} cb 回调cb(err,doc)
     * @return {Root} - for chaining
     */
  server (app = null, opts = {}, cb = null) {
    let err = null
    let doc = null
    let type = 'http'
    opts.uri && (type = utils.getUriProtocol(opts.uri))
    opts.type && (type = opts.type)
    type = type.toLowerCase()
    let fn = this.serverModules[type]
    if (!fn) {
      doc = Err.FA_INVALIDTYPE
      err = error.err(doc)
      if (cb) cb(err, doc)
    } else {
      app.emit('server', opts)
      fn(app, opts, cb)
    }
    return this
  }

  /**
     * 创建一个代理路由
     * 支持多种参数格式, 例如
     * proxy({uri:uri}, cb)
     * proxy(uri, cb)
     * 可以没有回调函数cb
     * proxy({uri:uri})
     * proxy(uri)
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 目标uri(必填)
     * }
     * @param {function} cb 回调cb(err,doc)
     * @return {Router}
     */
  proxy (opts = {}, cb = null) {
    let err = null
    let doc = null
    if (typeof opts === 'string') {
      opts = {uri: opts}
    }
    if (!opts.uri) {
      doc = error.Err.FA_PARAMS
      err = error.err(doc)
      if (!cb) throw err
    }
    let app = this.router()
    this.client(opts, function (err, client) {
      if (err) return cb(err, client)
      app.use(function (opts, cb) {
        client.request(opts, cb)
      })
      app.client = client
      if (cb) cb(null, app)
    })
    return app
  }
}

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {})
  let jm = global.jm
  if (!jm.ms) {
    let root = new Root()
    jm.ms = (opts) => {
      return root.router(opts)
    }
    let ms = jm.ms
    event.enableEvent(ms)
    ms.root = root

    ms.proxy = (opts, cb) => {
      root.proxy(opts, cb)
      return ms
    }

    ms.client = (opts, cb) => {
      root.client(opts, cb)
      return ms
    }

    ms.server = (opts, cb) => {
      root.server(opts, cb)
      return ms
    }
  }
}

export default Root
