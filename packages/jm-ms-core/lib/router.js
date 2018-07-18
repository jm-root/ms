const Route = require('./route')
const utils = require('./utils')
const error = require('jm-err')
const event = require('jm-event')

let Err = error.Err

let errNotfound = error.err(Err.FA_NOTFOUND)

let slice = Array.prototype.slice

/**
 * Class representing a router.
 */
class Router {
  /**
   * create a router.
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  sensitive: 是否大小写敏感(可选)
   *  strict: 是否检查末尾的分隔符(可选)
   * }
   */
  constructor (opts = {}) {
    this._routes = []
    this.sensitive = opts.sensitive
    this.strict = opts.strict
    // alias methods
    utils.enableType(this, ['get', 'post', 'put', 'delete'])
    event.enableEvent(this)
  }

  get routes () {
    return this._routes
  }

  /**
   * clear all routes.
   * @return {Router} for chaining
   */
  clear () {
    this._routes = []
    return this
  }

  /**
   * 添加接口定义
   * @function Router#_add
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
   * }
   * @return {Router} for chaining
   */
  _add (opts = {}) {
    let err = null
    let doc = null
    if (!opts.uri || !opts.fn) {
      doc = Err.FA_PARAMS
      err = error.err(doc)
      throw err
    }

    this.emit('add', opts)
    let o = Object.assign({}, opts)
    if (o.sensitive === undefined) o.sensitive = this.sensitive
    if (o.strict === undefined) o.strict = this.strict
    this._routes.push(new Route(o))
    return this
  }

  /**
   * 添加接口定义
   * 支持多种参数格式, 例如
   * add({uri:uri, type:type, fn:fn})
   * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
   * add(uri, fn)
   * add(uri, fn1, fn2, ..., fnn)
   * add(uri, [fn1, fn2, ..,fnn])
   * add(uri, type, fn)
   * add(uri, type, fn1, fn2, ..., fnn)
   * add(uri, type, [fn1, fn2, ..,fnn])
   * @function Router#add
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
   * }
   * @return {Router} for chaining
   */
  add (opts) {
    if (typeof opts === 'string') {
      opts = {
        uri: opts
      }
      if (typeof arguments[1] === 'string') {
        opts.type = arguments[1]
        if (Array.isArray(arguments[2])) {
          opts.fn = arguments[2]
        } else {
          opts.fn = slice.call(arguments, 2)
        }
      } else if (Array.isArray(arguments[1])) {
        opts.fn = arguments[1]
      } else {
        opts.fn = slice.call(arguments, 1)
      }
    }
    return this._add(opts)
  }

  /**
   * 引用路由定义
   * @function Router#_use
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(可选)
   *  fn: 接口处理函数 router实例 或者 function(opts){}(支持函数数组) 或者含有request或execute函数的对象(必填)
   * }
   * @return {Router} for chaining
   */
  _use (opts = {}) {
    let err = null
    let doc = null
    if (opts && typeof opts === 'object' && !opts.fn) {
      opts = {
        fn: opts
      }
    }
    if (!opts.fn) {
      doc = Err.FA_PARAMS
      err = error.err(doc)
      throw err
    }

    this.emit('use', opts)
    opts.strict = false
    opts.end = false
    opts.uri || (opts.uri = '/')
    if (typeof opts.fn === 'object') {
      let router = opts.fn
      if (router.request) {
        opts.router = router
        opts.fn = router.request.bind(router)
      } else if (router.execute) {
        opts.router = router
        opts.fn = router.execute.bind(router)
      }
    }
    return this._add(opts)
  }

  /**
   * 引用路由定义
   * use({uri:uri, fn:fn})
   * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
   * use({uri:uri, fn:router})
   * use({uri:uri, fn:obj})
   * use(router)
   * use(obj) obj必须实现了request或者handle函数之一，优先使用request
   * use(uri, fn)
   * use(uri, fn1, fn2, ..., fnn)
   * use(uri, [fn1, fn2, ..,fnn])
   * use(uri, router)
   * use(uri, obj)
   * use(uri, fn)
   * use(fn1, fn2, ..., fnn)
   * use([fn1, fn2, ..,fnn])
   * @function Router#use
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(可选)
   *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(必填)
   * }
   * @return {Router} for chaining
   */
  use (opts) {
    if (typeof opts === 'string') {
      opts = {
        uri: opts
      }
      if (typeof arguments[1] === 'object') { // object 或者 数组
        opts.fn = arguments[1]
      } else {
        opts.fn = slice.call(arguments, 1)
      }
    } else if (typeof opts === 'function') {
      opts = {
        fn: slice.call(arguments, 0)
      }
    } else if (Array.isArray(opts)) {
      opts = {
        fn: opts
      }
    } else if (typeof opts === 'object') {
      if (!opts.fn) {
        opts = {
          fn: opts
        }
      }
    }

    return this._use(opts)
  }

  /**
   * 请求
   * 支持多种参数格式, 例如
   * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
   * request(uri, type, data, opts)
   * request(uri, type, data)
   * request(uri, type)
   * request(uri)
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  data: 请求数据(可选)
   *  params: 请求参数(可选)
   *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
   * }
   * @return {Object}
   */
  async request (opts) {
    if (typeof opts !== 'object') {
      opts = utils.preRequest.apply(this, arguments)
    }
    let doc = await this.execute(opts)
    if (doc === undefined) { throw errNotfound }
    return doc
  }

  async notify (opts) {
    await this.request.apply(this, arguments)
  }

  async execute (opts) {
    let self = this
    let routes = self.routes
    let parentParams = opts.params
    let parentUri = opts.baseUri || ''
    let done = restore(opts, opts.baseUri, opts.params)
    opts.originalUri || (opts.originalUri = opts.uri)
    let uri = opts.uri

    for (let i = 0, len = routes.length; i < len; i++) {
      opts.baseUri = parentUri
      opts.uri = uri
      let route = routes[i]
      if (!route) {
        continue
      }
      let match = route.match(opts)
      if (!match) continue

      opts.params = Object.assign({}, parentParams, match.params)

      if (route.router) {
        opts.baseUri = parentUri + match.uri
        opts.uri = opts.uri.replace(match.uri, '')
      }
      let doc = await route.execute(opts)
      if (doc !== undefined) {
        done()
        return doc
      }
    }
    done()

    // restore obj props after function
    function restore (obj, baseUri, params) {
      return function () {
        obj.uri = obj.originalUri
        obj.baseUri = baseUri
        obj.params = params
      }
    }
  }
}

module.exports = Router
