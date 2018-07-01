import util from 'jm-utils'

let utils = util.utils
utils.enableType = function (obj, types) {
  if (!Array.isArray(types)) {
    types = [types]
  }
  types.forEach(function (type) {
    obj[type] = function () {
      let opts = utils.preRequest.apply(this, arguments)
      opts.type = type
      return obj.request(opts)
    }
  })
}

utils.preRequest = function (uri, type, data, opts) {
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
    return utils.preRequest(uri, null, type, data)
  } else if (typeof type === 'string') {
    r.type = type
  }

  // 第3个参数可能为空，data
  if (data === undefined) {
    return r
  } else if (data && typeof data === 'object') {
    r.data = data
  }

  // 第4个参数可能为空，cb，timeout, params
  if (opts === undefined) {
    return r
  } else if (opts && typeof opts === 'object') {
    r = Object.assign(r, opts)
  }

  return r
}

export default utils
