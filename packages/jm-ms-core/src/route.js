import pathtoRegexp from 'path-to-regexp'

/**
 * Class representing a route.
 */
class Route {
  /**
     * create a route.
     * @param {Object} opts params
     * @example
     * opts:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts, cb, next){}(必填)
     *
     * }
     */
  constructor (opts = {}) {
    this.uri = opts.uri || '/'
    this.type = opts.type
    this._fns = []
    this.keys = []
    opts.router && (this.router = opts.router)

    this.regexp = pathtoRegexp(this.uri, this.keys, opts)

    if (this.uri === '/' && opts.end === false) {
      this.regexp.fast_slash = true
    }

    if (this.type === undefined) {
      this.allType = true
    }

    let fns = opts.fn
    if (!Array.isArray(fns)) {
      fns = [fns]
    }

    for (let i = 0; i < fns.length; i++) {
      let fn = fns[i]
      if (typeof fn !== 'function') {
        let type = toString.call(fn)
        let msg = 'requires callback functions but got a ' + type
        throw new TypeError(msg)
      }

      this._fns.push(fn)
    }
  }

  get fns () {
    return this._fns
  }

  handle (opts, cb, next) {
    let idx = 0
    let fns = this.fns
    if (fns.length === 0) {
      return next()
    }
    _next()
    function _next (err, doc) {
      if (err) {
        if (err === 'route') { return next() } else { return cb(err, doc) }
      }
      let fn = fns[idx++]
      if (!fn) {
        return next(err)
      }
      try {
        fn(opts, cb, _next)
      } catch (err) {
        _next(err)
      }
    }
  }

  /**
     * Check if this route matches `uri`, if so
     * populate `.params`.
     *
     * @param {String} uri
     * @return {Boolean}
     * @api private
     */
  match (uri, type) {
    this.params = undefined
    this.uri = undefined

    type && (type = type.toLowerCase())
    if (type !== this.type && !this.allType) {
      return false
    }

    if (uri === null || uri === undefined) {
      // no uri, nothing matches
      return false
    }

    if (this.regexp.fast_slash) {
      // fast uri non-ending match for / (everything matches)
      this.params = {}
      this.uri = ''
      return true
    }

    let m = this.regexp.exec(uri)

    if (!m) {
      return false
    }

    // store values
    this.params = {}
    this.uri = m[0]

    let keys = this.keys
    let params = this.params

    for (let i = 1; i < m.length; i++) {
      let key = keys[i - 1]
      let prop = key.name
      params[prop] = m[i]
    }

    return true
  }
}

export default Route
