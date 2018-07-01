'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var preRequest = function preRequest(uri, type, data, opts) {
  // uri为对象时直接返回
  if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
    return uri;
  }

  var r = {
    uri: uri

    // 第2个参数可能为空，data
  };if (type === undefined) {
    return r;
  } else if (type && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    return preRequest(uri, null, type, data);
  } else if (typeof type === 'string') {
    r.type = type;
  }

  // 第3个参数可能为空，data
  if (data === undefined) {
    return r;
  } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    r.data = data;
  }

  // 第4个参数可能为空，附加参数对象
  if (opts === undefined) {
    return r;
  } else if (opts && (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
    r = Object.assign(r, opts);
  }

  return r;
};

var utils = {
  getUriProtocol: function getUriProtocol(uri) {
    if (!uri) return null;
    return uri.substring(0, uri.indexOf(':'));
  },

  getUriPath: function getUriPath(uri) {
    var idx = uri.indexOf('//');
    if (idx === -1) return '';
    idx = uri.indexOf('/', idx + 2);
    if (idx === -1) return '';
    uri = uri.substr(idx);
    idx = uri.indexOf('#');
    if (idx === -1) idx = uri.indexOf('?');
    if (idx !== -1) uri = uri.substr(0, idx);
    return uri;
  },

  enableType: function enableType(obj, types) {
    var self = this;
    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(function (type) {
      obj[type] = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var opts,
            doc,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = self.preRequest.apply(this, _args);

                opts.type = type;
                _context.next = 4;
                return obj.request(opts);

              case 4:
                doc = _context.sent;
                return _context.abrupt('return', doc);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    });
  },

  preRequest: preRequest

};

exports.default = utils;
module.exports = exports['default'];