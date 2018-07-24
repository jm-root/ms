const Route = require('jm-route')
const Matcher = require('./matcher')

class DefaultRoute extends Route {
  /**
   * create a route.
   * @param {Object} opts params
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  fn: 接口处理函数(必填)
   *
   * }
   */
  constructor (opts = {}) {
    super(opts.fn)
    this.name = `${opts.type || ''} ${opts.uri || ''}`
    this.matcher = new Matcher(opts)
    opts.router && (this.router = opts.router)
  }

  match (opts) {
    return this.matcher.match(opts)
  }
}

module.exports = DefaultRoute
