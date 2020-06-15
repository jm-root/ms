const { slice, getUriProtocol, getUriPath } = require('jm-utils')

/**
 * 减少一级array嵌套深度
 * [1, [2, [3, [4]], 5]] => [1, 2, [3, [4]], 5]
 * @param v
 */
function flatten (arr) {
  return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
}

/**
 * 统一add和use路由的参数
 * 支持多种参数格式, 例如
 * ({uri, type, fn})
 * ({uri, type, fn:[fn1, fn2, ..., fnn]})
 * ({uri, fn})
 * ({uri, fn:[fn1, fn2, ..., fnn]})
 * ({type, fn})
 * ({type, fn:[fn1, fn2, ..., fnn]})
 * ({fn})
 * ({fn:[fn1, fn2, ..., fnn]})
 *
 * (uri, type, fn)
 * (uri, type, fn1, fn2, ..., fnn)
 * (uri, type, [fn1, fn2, ..,fnn])
 * (uri, fn)
 * (uri, fn1, fn2, ..., fnn)
 * (uri, [fn1, fn2, ..,fnn])
 *
 * (fn)
 * (fn1, fn2, ..., fnn)
 * ([fn1, fn2, ..,fnn])
 *
 * fn 支持数组自动降级
 * (fn1, [fn2, fn3], fn4) => ([fn1, fn2, fn3, fn4])
 * ([fn1, [fn2, fn3], fn4]) => ([fn1, fn2, fn3, fn4])
 *
 * fn 支持函数对象混合传递
 * (fn1, obj1, obj2, router1, router2, fn2, ..., fnn)
 * ([fn1, obj1, obj2, router1, router2, fn2, ..,fnn])
 *
 * @param args 参数
 * @returns {{fn}|Object|*}
 * @example
 * {
 *  uri: 接口路径(可选)
 *  type: 请求类型(可选)
 *  fn: 接口处理函数(必填) function(opts){}, 函数或者函数数组，fn 也可以为 router 或者 object, 为object时必须实现了request或者execute函数之一，优先使用request
 * }
 */
function uniteParams (...args) {
  const opts = {}
  if (!args.length) return opts

  const obj = args[0]

  if (typeof obj === 'object' && obj.fn) return obj

  const uri = args[0]
  if (typeof uri === 'string') {
    opts.uri = uri
    args = slice(args, 1)
  }

  const type = args[0]
  if (typeof type === 'string') {
    opts.type = type
    args = slice(args, 1)
  }

  if (!args.length) return opts

  args = flatten(args)
  opts.fn = args.length === 1 ? args[0] : args

  return opts
}

function preRequest (uri, type, data, opts) {
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

module.exports = {
  getUriProtocol,
  getUriPath,

  enableType: function (obj, types) {
    if (!Array.isArray(types)) {
      types = [types]
    }
    types.forEach(function (type) {
      obj[type] = async function () {
        const opts = preRequest.apply(this, arguments)
        opts.type = type
        const doc = await obj.request(opts)
        return doc
      }
    })
  },

  uniteParams,
  preRequest

}
