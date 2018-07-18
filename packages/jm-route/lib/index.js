function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function compose () {
  let fns = []
  for (let i = 0, len = arguments.length; i < len; i++) {
    let o = arguments[i]
    if (Array.isArray(o)) {
      fns.push(...o)
    } else {
      fns.push(o)
    }
  }
  return async function (opts = {}) {
    for (let i = 0, len = fns.length; i < len; i++) {
      let fn = fns[i]
      let doc = fn(opts)
      if (isPromise(doc)) {
        doc = await doc
      }
      if (doc !== undefined) return doc
    }
  }
}

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

module.exports = Route
