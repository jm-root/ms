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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Err = _jmErr2.default.Err;

var errNotfound = _jmErr2.default.err(Err.FA_NOTFOUND);
var cbDefault = function cbDefault(err, doc) {};

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
   *  mergeParams: 是否合并参数(可选)
   *  sensitive: 是否大小写敏感(可选)
   *  strict: 是否检查末尾的分隔符(可选)
   * }
   */
  function Router() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    this._routes = [];
    ['mergeParams', 'sensitive', 'strict'].forEach(function (key) {
      opts[key] && (_this[key] = opts[key]);
    });
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
     * @param cb 回调cb(err,doc)
     * @return {Router} for chaining
     */

  }, {
    key: '_add',
    value: function _add(opts, cb) {
      opts = opts || {};
      var err = null;
      var doc = null;
      if (!opts.uri || !opts.fn) {
        doc = Err.FA_PARAMS;
        err = _jmErr2.default.err(doc);
        if (!cb) throw err;
      } else {
        this.emit('add', opts);
        var o = {};
        for (var key in opts) {
          o[key] = opts[key];
        }
        if (o.mergeParams === undefined) o.mergeParams = this.mergeParams;
        if (o.sensitive === undefined) o.sensitive = this.sensitive;
        if (o.strict === undefined) o.strict = this.strict;
        this._routes.push(new _route2.default(o));
      }
      if (cb) cb(err, doc);
      return this;
    }

    /**
     * 添加接口定义
     * 支持多种参数格式, 例如
     * add({uri:uri, type:type, fn:fn}, cb)
     * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
     * 可以没有回调函数cb
     * add({uri:uri, type:type, fn:fn})
     * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
     * 以下用法不能包含cb
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
     * @param cb 回调cb(err,doc)
     * @return {Router} for chaining
     */

  }, {
    key: 'add',
    value: function add(opts, cb) {
      if (typeof opts === 'string') {
        opts = {
          uri: opts
        };
        if (typeof cb === 'string') {
          opts.type = cb;
          if (Array.isArray(arguments[2])) {
            opts.fn = arguments[2];
          } else {
            opts.fn = slice.call(arguments, 2);
          }
        } else if (Array.isArray(cb)) {
          opts.fn = cb;
        } else {
          opts.fn = slice.call(arguments, 1);
        }
        cb = null;
      }
      return this._add(opts, cb);
    }

    /**
     * 引用路由定义
     * @function Router#_use
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(可选)
     *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(支持函数数组) 或者含有request或handle函数的对象(必填)
     * }
     * @param cb 回调cb(err,doc)
     * @return {Router} for chaining
     */

  }, {
    key: '_use',
    value: function _use(opts, cb) {
      opts = opts || {};
      var err = null;
      var doc = null;
      if (opts && opts instanceof Router) {
        opts = {
          fn: opts
        };
      }
      if (!opts.fn) {
        doc = Err.FA_PARAMS;
        err = _jmErr2.default.err(doc);
        if (!cb) throw err;
      } else {
        this.emit('use', opts);
        opts.strict = false;
        opts.end = false;
        opts.uri = opts.uri || '/';
        if (opts.fn instanceof Router) {
          var router = opts.fn;
          opts.router = router;
          opts.fn = function (opts, cb, next) {
            router.handle(opts, cb, next);
          };
        } else if (_typeof(opts.fn) === 'object') {
          var _router = opts.fn;
          if (_router.request) {
            opts.router = _router;
            opts.fn = function (opts, cb, next) {
              _router.request(opts, function (err, doc) {
                cb(err, doc);
                next();
              });
            };
          } else if (_router.handle) {
            opts.router = _router;
            opts.fn = function (opts, cb, next) {
              _router.handle(opts, cb, next);
            };
          }
        }
        return this._add(opts, cb);
      }
      if (cb) cb(err, doc);
      return this;
    }

    /**
     * 引用路由定义
     * 支持多种参数格式, 例如
     * use({uri:uri, fn:fn}, cb)
     * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
     * use({uri:uri, fn:router}, cb)
     * use({uri:uri, fn:obj}, cb)
     * use(router, cb)
     * 可以没有回调函数cb
     * use({uri:uri, fn:fn})
     * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
     * use({uri:uri, fn:router})
     * use({uri:uri, fn:obj})
     * use(router)
     * use(obj) obj必须实现了request或者handle函数之一，优先使用request
     * 以下用法不能包含cb
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
     * @param cb 回调cb(err,doc)
     * @return {Router} for chaining
     */

  }, {
    key: 'use',
    value: function use(opts, cb) {
      if (typeof opts === 'string') {
        opts = {
          uri: opts
        };
        if ((typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) === 'object') {
          // object 或者 数组
          opts.fn = cb;
        } else {
          opts.fn = slice.call(arguments, 1);
        }
        cb = null;
      } else if (typeof opts === 'function') {
        opts = {
          fn: slice.call(arguments, 0)
        };
        cb = null;
      } else if (Array.isArray(opts)) {
        opts = {
          fn: opts
        };
        cb = null;
      } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
        if (!opts.fn) {
          opts = {
            fn: opts
          };
        }
      }

      return this._use(opts, cb);
    }

    /**
     * 请求
     * 支持多种参数格式, 例如
     * request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
     * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
     * request(uri, type, data, params, timeout, cb)
     * request(uri, type, data, params, cb)
     * request(uri, type, data, cb)
     * request(uri, type, cb)
     * request(uri, cb)
     * request(uri, type, data, params, timeout)
     * request(uri, type, data, params)
     * request(uri, type, data)
     * request(uri, type)
     * request(uri)
     * request(uri, type, data, timeout, cb)
     * request(uri, type, timeout, cb)
     * request(uri, timeout, cb)
     * request(uri, type, data, timeout)
     * request(uri, type, timeout)
     * request(uri, timeout)
     * request(uri, data, params, timeout, cb)
     * request(uri, data, params, cb)
     * request(uri, data, cb)
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  data: 请求数据(可选)
     *  params: 请求参数(可选)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @param cb 回调(可选)cb(err,doc)
     * @return {Object}
     */

  }, {
    key: 'request',
    value: function request(opts, cb) {
      if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
        var r = _utils2.default.preRequest.apply(this, arguments);
        opts = r.opts;
        cb = r.cb;
      }
      if (typeof Promise !== 'undefined' && !cb) {
        var self = this;
        return new Promise(function (resolve, reject) {
          self.handle(opts, function (err, doc) {
            if (!err && doc && doc.err) err = _jmErr2.default.err(doc);
            if (err) return reject(err);
            resolve(doc);
          });
        });
      }
      return this.handle(opts, cb || cbDefault);
    }
  }, {
    key: 'handle',
    value: function handle(opts, _cb2, next) {
      if (!next) {
        // is a request
        var _opts = opts;
        var _cb = _cb2;
        opts = {};
        for (var key in _opts) {
          opts[key] = _opts[key];
        }
        _cb2 = function cb(err, doc) {
          if (_cb2.done) return;
          _cb2.done = true;
          _cb(err, doc);
        };
        next = function next(err, doc) {
          _cb2(err || errNotfound, doc || Err.FA_NOTFOUND);
        };
      }

      var self = this;
      var idx = 0;
      var routes = self.routes;
      var parentParams = opts.params;
      var parentUri = opts.baseUri || '';
      var done = restore(next, opts, opts.baseUri, opts.params);
      opts.originalUri || (opts.originalUri = opts.uri);
      var uri = opts.uri;
      _next();
      return self;

      function _next(err, doc) {
        if (err) {
          if (err === 'route') {
            return next();
          } else {
            return done(err, doc);
          }
        }
        if (_cb2.done) {
          return done();
        }
        opts.baseUri = parentUri;
        opts.uri = uri;
        // no more matching layers
        if (idx >= routes.length) {
          return done();
        }
        var match = false;
        var route = void 0;
        while (!match && idx < routes.length) {
          route = routes[idx++];
          if (!route) {
            continue;
          }
          try {
            match = route.match(opts.uri, opts.type);
          } catch (err) {
            return done(err, Err.FA_BADREQUEST);
          }
        }
        if (!match) {
          return done();
        }
        opts.params = {};
        for (var _key in parentParams) {
          opts.params[_key] = parentParams[_key];
        }
        for (var _key2 in route.params) {
          opts.params[_key2] = route.params[_key2];
        }

        if (route.router) {
          opts.baseUri = parentUri + route.uri;
          opts.uri = opts.uri.replace(route.uri, '');
        }
        route.handle(opts, _cb2, _next);
      }

      // restore obj props after function
      function restore(fn, obj, baseUri, params) {
        return function (err, doc) {
          // restore vals
          obj.baseUri = baseUri;
          obj.params = params;
          fn && fn(err, doc);
          return self;
        };
      }
    }
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