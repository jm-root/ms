let preRequest = function (uri, type, data, opts) {
  // uri为对象时直接返回
  if (typeof uri === 'object') {
    return uri
  }

  let r = {
    uri: uri
  }

  // 第2个参数可能为空，data
  if (type === undefined) {
    return r
  } else if (type && typeof type === 'object') {
    return preRequest(uri, null, type, data)
  } else if (typeof type === 'string') {
    r.type = type
  }

  // 第3个参数可能为空，data
  if (data === undefined) {
    return r
  } else if (data && typeof data === 'object') {
    r.data = data
  }

  // 第4个参数可能为空，附加参数对象
  if (opts === undefined) {
    return r
  } else if (opts && typeof opts === 'object') {
    r = Object.assign(r, opts)
  }

  return r
}

let utils = {
  getUriProtocol: function (uri) {
    if (!uri) return null
    return uri.substring(0, uri.indexOf(':'))
  },

  getUriPath: function (uri) {
    let idx = uri.indexOf('//')
    if (idx === -1) return ''
    idx = uri.indexOf('/', idx + 2)
    if (idx === -1) return ''
    uri = uri.substr(idx)
    idx = uri.indexOf('#')
    if (idx === -1) idx = uri.indexOf('?')
    if (idx !== -1) uri = uri.substr(0, idx)
    return uri
  },

  enableType: function (obj, types) {
    let self = this
    if (!Array.isArray(types)) {
      types = [types]
    }
    types.forEach(function (type) {
      obj[type] = async function () {
        let opts = self.preRequest.apply(this, arguments)
        opts.type = type
        let doc = await obj.request(opts)
        return doc
      }
    })
  },

  preRequest

}

module.exports =  utils
