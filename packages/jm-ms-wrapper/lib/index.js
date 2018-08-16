const error = require('jm-err')
let Err = error.Err

module.exports = t => {
  let cbErr = (e, opts) => {
    if (e.data) {
      let doc = e.data
      if (doc && opts.lng && doc.err && doc.msg) {
        doc = Object.assign({}, doc, {
          msg: (t && t(doc.msg, opts.lng)) || Err.t(doc.msg, opts.lng) || doc.msg
        })
      }
      doc.status === undefined && (doc.status = Err.FA_INTERNALERROR.err)
      e.data = doc
    }
    throw e
  }

  return fn => {
    if (fn.request && fn.on) {
      return fn.on('error', cbErr)
    }
    return async function (opts) {
      try {
        let doc = await fn(opts)
        return doc
      } catch (e) {
        cbErr(e, opts)
      }
    }
  }
}
