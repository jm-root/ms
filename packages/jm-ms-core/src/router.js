import Route from './route'
import utils from './utils'
import error from 'jm-err'
import event from 'jm-event'

let Err = error.Err

let errNotfound = error.err(Err.FA_NOTFOUND)
let cbDefault = (err, doc) => {
}

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
   *  mergeParams: 是否合并参数(可选)
   *  sensitive: 是否大小写敏感(可选)
   *  strict: 是否检查末尾的分隔符(可选)
   * }
   */
  constructor (opts = {}) {
    this._routes = [];
    ['mergeParams', 'sensitive', 'strict'].forEach((key) => {
      opts[key] && (this[key] = opts[key])
    })
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
   * @param cb 回调cb(err,doc)
   * @return {Router} for chaining
   */
  _add (opts, cb) {
    opts = opts || {}
    let err = null
    let doc = null
    if (!opts.uri || !opts.fn) {
      doc = Err.FA_PARAMS
      err = error.err(doc)
      if (!cb) throw err
    } else {
      this.emit('add', opts)
      let o = {}
      for (let key in opts) {
        o[key] = opts[key]
      }
      if (o.mergeParams === undefined) o.mergeParams = this.mergeParams
      if (o.sensitive === undefined) o.sensitive = this.sensitive
      if (o.strict === undefined) o.strict = this.strict
      this._routes.push(new Route(o))
    }
    if (cb) cb(err, doc)
    return this
  }

  /**
   * 添加接口定义
   * 支持多种参数格式, 例如
   * add({uri:uri, type:type, fn:fn}, cb)
   * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
   * 可以没有回调函数cb
   * add({uri:uri, type:type, fn:fn})
   * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
   * 以下用法不能包含cb
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
   * @param cb 回调cb(err,doc)
   * @return {Router} for chaining
   */
  add (opts, cb) {
    if (typeof opts === 'string') {
      opts = {
        uri: opts
      }
      if (typeof cb === 'string') {
        opts.type = cb
        if (Array.isArray(arguments[2])) {
          opts.fn = arguments[2]
        } else {
          opts.fn = slice.call(arguments, 2)
        }
      } else if (Array.isArray(cb)) {
        opts.fn = cb
      } else {
        opts.fn = slice.call(arguments, 1)
      }
      cb = null
    }
    return this._add(opts, cb)
  }

  /**
   * 引用路由定义
   * @function Router#_use
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(可选)
   *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(支持函数数组) 或者含有request或handle函数的对象(必填)
   * }
   * @param cb 回调cb(err,doc)
   * @return {Router} for chaining
   */
  _use (opts, cb) {
    opts = opts || {}
    let err = null
    let doc = null
    if (opts && opts instanceof Router) {
      opts = {
        fn: opts
      }
    }
    if (!opts.fn) {
      doc = Err.FA_PARAMS
      err = error.err(doc)
      if (!cb) throw err
    } else {
      this.emit('use', opts)
      opts.strict = false
      opts.end = false
      opts.uri = opts.uri || '/'
      if (opts.fn instanceof Router) {
        let router = opts.fn
        opts.router = router
        opts.fn = function (opts, cb, next) {
          router.handle(opts, cb, next)
        }
      } else if (typeof opts.fn === 'object') {
        let router = opts.fn
        if (router.request) {
          opts.router = router
          opts.fn = function (opts, cb, next) {
            router.request(opts, function (err, doc) {
              cb(err, doc)
              next()
            })
          }
        } else if (router.handle) {
          opts.router = router
          opts.fn = function (opts, cb, next) {
            router.handle(opts, cb, next)
          }
        }
      }
      return this._add(opts, cb)
    }
    if (cb) cb(err, doc)
    return this
  }

  /**
   * 引用路由定义
   * 支持多种参数格式, 例如
   * use({uri:uri, fn:fn}, cb)
   * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
   * use({uri:uri, fn:router}, cb)
   * use({uri:uri, fn:obj}, cb)
   * use(router, cb)
   * 可以没有回调函数cb
   * use({uri:uri, fn:fn})
   * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
   * use({uri:uri, fn:router})
   * use({uri:uri, fn:obj})
   * use(router)
   * use(obj) obj必须实现了request或者handle函数之一，优先使用request
   * 以下用法不能包含cb
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
   * @param cb 回调cb(err,doc)
   * @return {Router} for chaining
   */
  use (opts, cb) {
    if (typeof opts === 'string') {
      opts = {
        uri: opts
      }
      if (typeof cb === 'object') { // object 或者 数组
        opts.fn = cb
      } else {
        opts.fn = slice.call(arguments, 1)
      }
      cb = null
    } else if (typeof opts === 'function') {
      opts = {
        fn: slice.call(arguments, 0)
      }
      cb = null
    } else if (Array.isArray(opts)) {
      opts = {
        fn: opts
      }
      cb = null
    } else if (typeof opts === 'object') {
      if (!opts.fn) {
        opts = {
          fn: opts
        }
      }
    }

    return this._use(opts, cb)
  }

  /**
   * 请求
   * 支持多种参数格式, 例如
   * request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
   * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
   * request(uri, type, data, params, timeout, cb)
   * request(uri, type, data, params, cb)
   * request(uri, type, data, cb)
   * request(uri, type, cb)
   * request(uri, cb)
   * request(uri, type, data, params, timeout)
   * request(uri, type, data, params)
   * request(uri, type, data)
   * request(uri, type)
   * request(uri)
   * request(uri, type, data, timeout, cb)
   * request(uri, type, timeout, cb)
   * request(uri, timeout, cb)
   * request(uri, type, data, timeout)
   * request(uri, type, timeout)
   * request(uri, timeout)
   * request(uri, data, params, timeout, cb)
   * request(uri, data, params, cb)
   * request(uri, data, cb)
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  data: 请求数据(可选)
   *  params: 请求参数(可选)
   *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
   * }
   * @param cb 回调(可选)cb(err,doc)
   * @return {Object}
   */
  request (opts, cb) {
    if (typeof opts !== 'object') {
      let r = utils.preRequest.apply(this, arguments)
      opts = r.opts
      cb = r.cb
    }
    if ((typeof Promise) !== 'undefined' && !cb) {
      let self = this
      return new Promise((resolve, reject) => {
        self.handle(opts, (err, doc) => {
          if (!err && doc && doc.err) err = error.err(doc)
          if (err) return reject(err)
          resolve(doc)
        })
      })
    }
    return this.handle(opts, cb || cbDefault)
  }

  handle (opts, cb, next) {
    if (!next) {
      // is a request
      let _opts = opts
      let _cb = cb
      opts = {}
      for (let key in _opts) {
        opts[key] = _opts[key]
      }
      cb = function (err, doc) {
        if (cb.done) return
        cb.done = true
        _cb(err, doc)
      }
      next = function (err, doc) {
        cb(err || errNotfound, doc || Err.FA_NOTFOUND)
      }
    }

    let self = this
    let idx = 0
    let routes = self.routes
    let parentParams = opts.params
    let parentUri = opts.baseUri || ''
    let done = restore(next, opts, opts.baseUri, opts.params)
    opts.originalUri || (opts.originalUri = opts.uri)
    let uri = opts.uri
    _next()
    return self

    function _next (err, doc) {
      if (err) {
        if (err === 'route') { return next() } else { return done(err, doc) }
      }
      if (cb.done) {
        return done()
      }
      opts.baseUri = parentUri
      opts.uri = uri
      // no more matching layers
      if (idx >= routes.length) {
        return done()
      }
      let match = false
      let route
      while (!match && idx < routes.length) {
        route = routes[idx++]
        if (!route) {
          continue
        }
        try {
          match = route.match(opts.uri, opts.type)
        } catch (err) {
          return done(err, Err.FA_BADREQUEST)
        }
      }
      if (!match) {
        return done()
      }
      opts.params = {}
      for (let key in parentParams) {
        opts.params[key] = parentParams[key]
      }
      for (let key in route.params) {
        opts.params[key] = route.params[key]
      }

      if (route.router) {
        opts.baseUri = parentUri + route.uri
        opts.uri = opts.uri.replace(route.uri, '')
      }
      route.handle(opts, cb, _next)
    }

    // restore obj props after function
    function restore (fn, obj, baseUri, params) {
      return function (err, doc) {
        // restore vals
        obj.baseUri = baseUri
        obj.params = params
        fn && fn(err, doc)
        return self
      }
    }
  }
}

export default Router
