function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function $ () {
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

export default $
