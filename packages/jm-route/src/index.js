import compose from './compose'

/**
 * Class representing a route.
 */
class Route {
  constructor (fns) {
    this.init.apply(this, arguments)
  }

  init (fns) {
    this.fn = compose.apply(this, arguments)
  }

  async execute (opts) {
    let doc = await this.fn(opts)
    if (doc !== undefined) return doc
  }
}

export default Route
