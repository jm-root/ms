function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

/**
 * Class representing a route.
 */
class Route {
  constructor (fns) {
    this.logging = false
    this.benchmark = false
    this.fns = [...arguments]
  }

  get fns () {
    return this._fns
  }

  set fns (value) {
    let fns = []
    for (let i = 0, len = value.length; i < len; i++) {
      let o = value[i]
      if (Array.isArray(o)) {
        fns.push(...o)
      } else {
        fns.push(o)
      }
    }
    this._fns = fns
  }

  async execute (opts) {
    let t1 = 0
    let t2 = 0
    let doc
    let fns = this.fns
    if (this.logging) {
      if (this.benchmark) t1 = Date.now()
      let msg = `Execute`
      this.name && (msg += ` ${this.name}`)
      msg += ` args: ${JSON.stringify([...arguments])}`
      console.info(msg)
    }
    for (let i = 0, len = fns.length; i < len; i++) {
      let fn = fns[i]
      if (this.logging && this.benchmark) t2 = Date.now()
      doc = fn(...arguments)
      if (isPromise(doc)) {
        doc = await doc
      }
      if (this.logging) {
        let msg = `Step: ${i} ${fn.name} args: ${JSON.stringify([...arguments])}`
        if (this.benchmark) msg += ` Elapsed time: ${Date.now() - t2}ms`
        console.info(msg)
      }
      if (doc !== undefined) break
    }
    if (this.logging) {
      let msg = `Executed`
      this.name && (msg += ` ${this.name}`)
      if (doc !== undefined) msg += ` result: ${JSON.stringify(doc)}`
      if (this.benchmark) msg += ` Elapsed time: ${Date.now() - t1}ms`
      console.info(msg)
    }
    if (doc !== undefined) return doc
  }
}

module.exports = Route
