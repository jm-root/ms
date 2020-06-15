const { Types } = require('./consts')
const Route = require('./route')
const { enableType, uniteParams, preRequest } = require('./utils')
const QuickRoute = require('./quickroute')
const error = require('jm-err')
const event = require('jm-event')
const { slice } = require('jm-utils')
const Err = error.Err

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
   *  logging 是否打印日志，默认false
   *  benchmark 是否计算耗时，默认false
   * }
   */
  constructor (opts = {}) {
    this._routes = []
    this.sensitive = opts.sensitive
    this.strict = opts.strict
    this._logging = opts.logging || false
    this._benchmark = opts.benchmark || false
    // alias methods
    enableType(this, Types)
    event.enableEvent(this)
  }

  get logging () {
    return this._logging
  }

  set logging (value) {
    this._logging = value
    this._routes.forEach(route => {
      route.logging = value
    })
  }

  get benchmark () {
    return this._benchmark
  }

  set benchmark (value) {
    this._benchmark = value
    this._routes.forEach(route => {
      route.benchmark = value
    })
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
   *  uri: 接口路径(可选)，
   *  type: 请求类型(可选)
   *  fn: 接口处理函数 function(opts){}, 支持数组(必填)
   * }
   * @return {Router} for chaining
   */
  _add (opts = {}) {
    let { fn } = opts
    if (!fn) {
      throw error.err(Err.FA_PARAMS)
    }

    // fn 为数组时的处理
    if (Array.isArray(fn)) {
      const { length } = fn
      if (!length) {
        // 数组为空时, 参数错误
        throw error.err(Err.FA_PARAMS)
      } else if (length === 1) {
        // 数组只有一个元素时, 直接取出元素再处理
        fn = fn[0]
      } else {
        // 检查数组中是否存在对象，如果存在需要拆分后再添加
        for (let i = 0; i < fn.length; i++) {
          if (typeof fn[i] === 'object') {
            if (i > 0) {
              this._add({ ...opts, fn: slice(fn, 0, i) })
            }
            this._add({ ...opts, fn: fn[i] })
            if (i < fn.length - 1) {
              this._add({ ...opts, fn: slice(fn, i + 1) })
            }
            return this
          }
        }
      }
    }

    this.emit('add', opts)

    const o = { ...opts }

    if (typeof fn === 'object') {
      o.router = fn
      const { request, execute } = fn
      if (request) {
        o.fn = request.bind(fn)
      } else if (execute) {
        o.fn = execute.bind(fn)
      }
    }

    o.uri || (o.uri = '/')
    if (o.sensitive === undefined) o.sensitive = this.sensitive
    if (o.strict === undefined) o.strict = this.strict
    const route = new Route(o)
    route.logging = this._logging
    route.benchmark = this._benchmark
    this._routes.push(route)
    return this
  }

  /**
   * 添加接口定义, 精确匹配 uri
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
  add (...args) {
    const opts = uniteParams(...args)
    return this._add(opts)
  }

  /**
   * 引用路由定义, 匹配所有 uri
   * use({uri:uri, fn:fn})
   * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
   * use({uri:uri, fn:router})
   * use({uri:uri, fn:obj}) obj必须实现了request或者execute函数之一，优先使用request
   * use(uri, fn)
   * use(uri, fn1, fn2, ..., fnn)
   * use(uri, [fn1, fn2, ..,fnn])
   * use(uri, router)
   * use(uri, obj)
   * use(fn)
   * use(router)
   * use(obj)
   * use(fn1, fn2, ..., fnn)
   * use([fn1, fn2, ..,fnn])
   * @function Router#use
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  uri: 接口路径(可选)
   *  fn: 接口处理函数 router实例 或者 function(opts){}(必填)
   * }
   * @return {Router} for chaining
   */
  use (...args) {
    const opts = uniteParams(...args)
    this.emit('use', opts)
    opts.strict = false
    opts.end = false
    return this.add(opts)
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
    let t1 = 0
    if (this.logging) {
      if (this.benchmark) t1 = Date.now()
      let msg = 'Request'
      this.name && (msg += ` ${this.name}`)
      msg += ` args: ${JSON.stringify(opts)}`
      console.info(msg)
    }
    if (typeof opts !== 'object') {
      opts = preRequest.apply(this, arguments)
    }
    let doc = null
    try {
      doc = await this.execute(opts)
    } catch (e) {
      const ret = await this.emit('error', e, opts)
      if (ret === undefined) {
        throw e
      }
      doc = ret
      if (this.logging) {
        console.info('error catched, return', doc)
        console.error(e)
      }
    }
    if (this.logging) {
      let msg = 'Request'
      this.name && (msg += ` ${this.name}`)
      if (doc !== undefined) msg += ` result: ${JSON.stringify(doc)}`
      if (this.benchmark) msg += ` Elapsed time: ${Date.now() - t1}ms`
      console.info(msg)
    }
    return doc
  }

  async execute (opts) {
    const self = this
    const routes = self.routes
    const parentParams = opts.params
    const parentUri = opts.baseUri || ''
    const done = restore(opts, opts.baseUri, opts.params)
    opts.originalUri || (opts.originalUri = opts.uri)
    const uri = opts.uri

    for (let i = 0, len = routes.length; i < len; i++) {
      opts.baseUri = parentUri
      opts.uri = uri
      const route = routes[i]
      if (!route) {
        continue
      }
      const match = route.match(opts)
      if (!match) continue

      opts.params = Object.assign({}, parentParams, match.params)

      if (route.router) {
        opts.baseUri = parentUri + match.uri
        opts.uri = opts.uri.replace(match.uri, '')
      }
      const doc = await route.execute(opts)
      done()
      if (doc !== undefined) {
        return doc
      }
    }

    // restore obj props after function
    function restore (obj, baseUri, params) {
      return function () {
        obj.uri = obj.originalUri
        obj.baseUri = baseUri
        obj.params = params
      }
    }
  }

  /**
   * 快捷的路由增加方式
   * Router.route('/xx/xxxx')
   * .get
   * .post
   * .put
   * .delete
   * .use
   * .add
   * @param uri
   */
  route (uri) {
    return new QuickRoute(this, uri)
  }
}

module.exports = Router
