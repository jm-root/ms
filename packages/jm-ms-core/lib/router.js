'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Err = _jmErr2.default.Err;

var errNotfound = _jmErr2.default.err(Err.FA_NOTFOUND);

var slice = Array.prototype.slice;

/**
 * Class representing a router.
 */

var Router = function () {
  /**
   * create a router.
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  sensitive: 是否大小写敏感(可选)
   *  strict: 是否检查末尾的分隔符(可选)
   * }
   */
  function Router() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    this._routes = [];
    this.sensitive = opts.sensitive;
    this.strict = opts.strict;
    // alias methods
    _utils2.default.enableType(this, ['get', 'post', 'put', 'delete']);
    _jmEvent2.default.enableEvent(this);
  }

  _createClass(Router, [{
    key: 'clear',


    /**
     * clear all routes.
     * @return {Router} for chaining
     */
    value: function clear() {
      this._routes = [];
      return this;
    }

    /**
     * 添加接口定义
     * @function Router#_add
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: '_add',
    value: function _add() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var err = null;
      var doc = null;
      if (!opts.uri || !opts.fn) {
        doc = Err.FA_PARAMS;
        err = _jmErr2.default.err(doc);
        throw err;
      }

      this.emit('add', opts);
      var o = Object.assign({}, opts);
      if (o.sensitive === undefined) o.sensitive = this.sensitive;
      if (o.strict === undefined) o.strict = this.strict;
      this._routes.push(new _route2.default(o));
      return this;
    }

    /**
     * 添加接口定义
     * 支持多种参数格式, 例如
     * add({uri:uri, type:type, fn:fn})
     * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
     * add(uri, fn)
     * add(uri, fn1, fn2, ..., fnn)
     * add(uri, [fn1, fn2, ..,fnn])
     * add(uri, type, fn)
     * add(uri, type, fn1, fn2, ..., fnn)
     * add(uri, type, [fn1, fn2, ..,fnn])
     * @function Router#add
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: 'add',
    value: function add(opts) {
      if (typeof opts === 'string') {
        opts = {
          uri: opts
        };
        if (typeof arguments[1] === 'string') {
          opts.type = arguments[1];
          if (Array.isArray(arguments[2])) {
            opts.fn = arguments[2];
          } else {
            opts.fn = slice.call(arguments, 2);
          }
        } else if (Array.isArray(arguments[1])) {
          opts.fn = arguments[1];
        } else {
          opts.fn = slice.call(arguments, 1);
        }
      }
      return this._add(opts);
    }

    /**
     * 引用路由定义
     * @function Router#_use
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(可选)
     *  fn: 接口处理函数 router实例 或者 function(opts){}(支持函数数组) 或者含有request或execute函数的对象(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: '_use',
    value: function _use() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var err = null;
      var doc = null;
      if (opts && (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object' && !opts.fn) {
        opts = {
          fn: opts
        };
      }
      if (!opts.fn) {
        doc = Err.FA_PARAMS;
        err = _jmErr2.default.err(doc);
        throw err;
      }

      this.emit('use', opts);
      opts.strict = false;
      opts.end = false;
      opts.uri || (opts.uri = '/');
      if (_typeof(opts.fn) === 'object') {
        var router = opts.fn;
        if (router.request) {
          opts.router = router;
          opts.fn = router.request.bind(router);
        } else if (router.execute) {
          opts.router = router;
          opts.fn = router.execute.bind(router);
        }
      }
      return this._add(opts);
    }

    /**
     * 引用路由定义
     * use({uri:uri, fn:fn})
     * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
     * use({uri:uri, fn:router})
     * use({uri:uri, fn:obj})
     * use(router)
     * use(obj) obj必须实现了request或者handle函数之一，优先使用request
     * use(uri, fn)
     * use(uri, fn1, fn2, ..., fnn)
     * use(uri, [fn1, fn2, ..,fnn])
     * use(uri, router)
     * use(uri, obj)
     * use(uri, fn)
     * use(fn1, fn2, ..., fnn)
     * use([fn1, fn2, ..,fnn])
     * @function Router#use
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(可选)
     *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: 'use',
    value: function use(opts) {
      if (typeof opts === 'string') {
        opts = {
          uri: opts
        };
        if (_typeof(arguments[1]) === 'object') {
          // object 或者 数组
          opts.fn = arguments[1];
        } else {
          opts.fn = slice.call(arguments, 1);
        }
      } else if (typeof opts === 'function') {
        opts = {
          fn: slice.call(arguments, 0)
        };
      } else if (Array.isArray(opts)) {
        opts = {
          fn: opts
        };
      } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
        if (!opts.fn) {
          opts = {
            fn: opts
          };
        }
      }

      return this._use(opts);
    }

    /**
     * 请求
     * 支持多种参数格式, 例如
     * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
     * request(uri, type, data, opts)
     * request(uri, type, data)
     * request(uri, type)
     * request(uri)
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  data: 请求数据(可选)
     *  params: 请求参数(可选)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @return {Object}
     */

  }, {
    key: 'request',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
        var doc,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
                  opts = _utils2.default.preRequest.apply(this, _args);
                }
                _context.next = 3;
                return this.execute(opts);

              case 3:
                doc = _context.sent;

                if (!(doc === undefined)) {
                  _context.next = 6;
                  break;
                }

                throw errNotfound;

              case 6:
                return _context.abrupt('return', doc);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x4) {
        return _ref.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: 'execute',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(opts) {
        var self, routes, parentParams, parentUri, done, uri, i, len, route, match, doc, restore;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                restore = function restore(obj, baseUri, params) {
                  return function () {
                    obj.uri = obj.originalUri;
                    obj.baseUri = baseUri;
                    obj.params = params;
                  };
                };

                self = this;
                routes = self.routes;
                parentParams = opts.params;
                parentUri = opts.baseUri || '';
                done = restore(opts, opts.baseUri, opts.params);

                opts.originalUri || (opts.originalUri = opts.uri);
                uri = opts.uri;
                i = 0, len = routes.length;

              case 9:
                if (!(i < len)) {
                  _context2.next = 29;
                  break;
                }

                opts.baseUri = parentUri;
                opts.uri = uri;
                route = routes[i];

                if (route) {
                  _context2.next = 15;
                  break;
                }

                return _context2.abrupt('continue', 26);

              case 15:
                match = route.match(opts);

                if (match) {
                  _context2.next = 18;
                  break;
                }

                return _context2.abrupt('continue', 26);

              case 18:

                opts.params = Object.assign({}, parentParams, match.params);

                if (route.router) {
                  opts.baseUri = parentUri + match.uri;
                  opts.uri = opts.uri.replace(match.uri, '');
                }
                _context2.next = 22;
                return route.execute(opts);

              case 22:
                doc = _context2.sent;

                if (!(doc !== undefined)) {
                  _context2.next = 26;
                  break;
                }

                done();
                return _context2.abrupt('return', doc);

              case 26:
                i++;
                _context2.next = 9;
                break;

              case 29:
                done();

                // restore obj props after function

              case 30:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function execute(_x5) {
        return _ref2.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'routes',
    get: function get() {
      return this._routes;
    }
  }]);

  return Router;
}();

exports.default = Router;
module.exports = exports['default'];