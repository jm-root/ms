const pathtoRegexp = require('path-to-regexp')

/**
 * Class representing a matcher.
 */
class Matcher {
  /**
   * create a matcher.
   * @param {Object} opts
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  sensitive: 是否大小写敏感, 默认false(可选)
   *  strict: 是否检查末尾的分隔符, 默认false(可选)
   *  end: When false the path will match at the beginning. (default: true)
   * }
   */
  constructor (opts = {}) {
    const uri = opts.uri || '/'
    let type = opts.type
    type && (type = type.toLowerCase())
    this.type = type
    this.keys = []

    this.regexp = pathtoRegexp(uri, this.keys, opts)

    if (uri === '/' && opts.end === false) {
      this.fast_slash = true
    }

    if (type === undefined) {
      this.allType = true
    }
  }

  /**
   * Check if this matcher matches `uri`, if so
   * populate `.params and .uri`.
   *
   * @param {String} uri
   * @return {Object}
   * @api private
   */
  match (opts = {}) {
    let params
    let uri = opts.uri

    let type = opts.type
    type && (type = type.toLowerCase())

    if (type !== this.type && !this.allType) return false
    if (uri === null || uri === undefined) return false

    if (this.fast_slash) {
      // fast uri non-ending match for / (everything matches)
      params = {}
      uri = ''
      return {
        params,
        uri
      }
    }

    const m = this.regexp.exec(uri)

    if (!m) return false

    // store values
    params = {}
    uri = m[0]
    const keys = this.keys
    for (let i = 1; i < m.length; i++) {
      const key = keys[i - 1]
      const prop = key.name
      params[prop] = m[i]
    }

    return {
      params,
      uri
    }
  }
}

module.exports = Matcher
