'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jmErr = _interopDefault(require('jm-err'));
var jmEvent = _interopDefault(require('jm-event'));
var jmModule = _interopDefault(require('jm-module'));
var jmUtils = _interopDefault(require('jm-utils'));
var jmRoute = _interopDefault(require('jm-route'));
var pathToRegexp = _interopDefault(require('path-to-regexp'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var slice = jmUtils.slice,
    getUriProtocol = jmUtils.getUriProtocol,
    getUriPath = jmUtils.getUriPath;
/**
 * 减少一级array嵌套深度
 * [1, [2, [3, [4]], 5]] => [1, 2, [3, [4]], 5]
 * @param v
 */

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
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


function flatten(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}

function uniteParams() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var opts = {};
  if (!args.length) return opts;
  var obj = args[0];
  if (_typeof(obj) === 'object' && obj.fn) return obj;
  var uri = args[0];

  if (typeof uri === 'string') {
    opts.uri = uri;
    args = slice(args, 1);
  }

  var type = args[0];

  if (typeof type === 'string') {
    opts.type = type;
    args = slice(args, 1);
  }

  if (!args.length) return opts;
  args = flatten(args);
  opts.fn = args.length === 1 ? args[0] : args;
  return opts;
}

function preRequest(uri, type, data, opts) {
  // uri为对象时直接返回
  if (_typeof(uri) === 'object') {
    return uri;
  }

  var r = {
    uri: uri
  }; // 第2个参数可能为空，data

  if (type === undefined) {
    return r;
  } else if (type && _typeof(type) === 'object') {
    return preRequest(uri, null, type, data);
  } else if (typeof type === 'string') {
    r.type = type;
  } // 第3个参数可能为空，data


  if (data === undefined) {
    return r;
  } else if (data && _typeof(data) === 'object') {
    r.data = data;
  } // 第4个参数可能为空，附加参数对象


  if (opts === undefined) {
    return r;
  } else if (opts && _typeof(opts) === 'object') {
    r = Object.assign(r, opts);
  }

  return r;
}

var utils = {
  getUriProtocol: getUriProtocol,
  getUriPath: getUriPath,
  enableType: function enableType(obj, types) {
    if (!Array.isArray(types)) {
      types = [types];
    }

    types.forEach(function (type) {
      obj[type] = _async(function () {
        var _this = this,
            _arguments = arguments;

        var opts = preRequest.apply(_this, _arguments);
        opts.type = type;
        return obj.request(opts);
      });
    });
  },
  uniteParams: uniteParams,
  preRequest: preRequest
};

var consts = {
  Types: ['get', 'post', 'put', 'delete']
};

/**
 * Class representing a matcher.
 */

var Matcher = /*#__PURE__*/function () {
  /**
   * create a matcher.
   * @param {Object} opts
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  sensitive: 是否大小写敏感, 默认false(可选)
   *  strict: 是否检查末尾的分隔符, 默认false(可选)
   *  end: When false the path will match at the beginning. (default: true)
   * }
   */
  function Matcher() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Matcher);

    var uri = opts.uri || '/';
    var type = opts.type;
    type && (type = type.toLowerCase());
    this.type = type;
    this.keys = [];
    this.regexp = pathToRegexp(uri, this.keys, opts);

    if (uri === '/' && opts.end === false) {
      this.fast_slash = true;
    }

    if (type === undefined) {
      this.allType = true;
    }
  }
  /**
   * Check if this matcher matches `uri`, if so
   * populate `.params and .uri`.
   *
   * @param {String} uri
   * @return {Object}
   * @api private
   */


  _createClass(Matcher, [{
    key: "match",
    value: function match() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var params;
      var uri = opts.uri;
      var type = opts.type;
      type && (type = type.toLowerCase());
      if (type !== this.type && !this.allType) return false;
      if (uri === null || uri === undefined) return false;

      if (this.fast_slash) {
        // fast uri non-ending match for / (everything matches)
        params = {};
        uri = '';
        return {
          params: params,
          uri: uri
        };
      }

      var m = this.regexp.exec(uri);
      if (!m) return false; // store values

      params = {};
      uri = m[0];
      var keys = this.keys;

      for (var i = 1; i < m.length; i++) {
        var key = keys[i - 1];
        var prop = key.name;
        params[prop] = m[i];
      }

      return {
        params: params,
        uri: uri
      };
    }
  }]);

  return Matcher;
}();

var matcher = Matcher;

var DefaultRoute = /*#__PURE__*/function (_Route) {
  _inherits(DefaultRoute, _Route);

  var _super = _createSuper(DefaultRoute);

  /**
   * create a route.
   * @param {Object} opts params
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  fn: 接口处理函数(必填)
   *
   * }
   */
  function DefaultRoute() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DefaultRoute);

    _this = _super.call(this, opts.fn);
    _this.name = "".concat(opts.type || '', " ").concat(opts.uri || '');
    _this.matcher = new matcher(opts);
    opts.router && (_this.router = opts.router);
    return _this;
  }

  _createClass(DefaultRoute, [{
    key: "match",
    value: function match(opts) {
      return this.matcher.match(opts);
    }
  }]);

  return DefaultRoute;
}(jmRoute);

var route = DefaultRoute;

var Types = consts.Types;
var uniteParams$1 = utils.uniteParams;
/**
 * 快速添加路由
 */

var quickroute = /*#__PURE__*/function () {
  function quickroute(router, uri) {
    var _this = this;

    _classCallCheck(this, quickroute);

    Object.assign(this, {
      router: router,
      uri: uri
    });

    var _iterator = _createForOfIteratorHelper(Types),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var type = _step.value;

        this[type] = function () {
          return _this.add.apply(_this, arguments);
        };
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  _createClass(quickroute, [{
    key: "add",
    value: function add() {
      var uri = this.uri;
      var opts = uniteParams$1.apply(void 0, arguments);

      if (uri) {
        opts.uri = opts.uri ? "".concat(uri).concat(opts.uri) : uri;
      }

      this.router.add(opts);
      return this;
    }
  }, {
    key: "use",
    value: function use() {
      var uri = this.uri;
      var opts = uniteParams$1.apply(void 0, arguments);

      if (uri) {
        opts.uri = opts.uri ? "".concat(uri).concat(opts.uri) : uri;
      }

      this.router.use(opts);
      return this;
    }
  }]);

  return quickroute;
}();

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var Types$1 = consts.Types;

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

var enableType = utils.enableType,
    uniteParams$2 = utils.uniteParams,
    preRequest$1 = utils.preRequest;

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

var slice$1 = jmUtils.slice;

function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    var observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}

var Err = jmErr.Err;
/**
 * Class representing a router.
 */

var _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;

    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        var value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}

function _for(test, update, body) {
  var stage;

  for (;;) {
    var shouldContinue = test();

    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }

    if (!shouldContinue) {
      return result;
    }

    if (shouldContinue.then) {
      stage = 0;
      break;
    }

    var result = body();

    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }

    if (update) {
      var updateValue = update();

      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }

  var pact = new _Pact();

  var reject = _settle.bind(null, pact, 2);

  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;

  function _resumeAfterBody(value) {
    result = value;

    do {
      if (update) {
        updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }

      shouldContinue = test();

      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);

        return;
      }

      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }

      result = body();

      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);

    result.then(_resumeAfterBody).then(void 0, reject);
  }

  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }

  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}

var Router = /*#__PURE__*/function () {
  /**
   * create a router.
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  sensitive: 是否大小写敏感(可选)
   *  strict: 是否检查末尾的分隔符(可选)
   *  logging 是否打印日志，默认false
   *  benchmark 是否计算耗时，默认false
   * }
   */
  function Router() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    this._routes = [];
    this.sensitive = opts.sensitive;
    this.strict = opts.strict;
    this._logging = opts.logging || false;
    this._benchmark = opts.benchmark || false; // alias methods

    enableType(this, Types$1);
    jmEvent.enableEvent(this);
  }

  _createClass(Router, [{
    key: "clear",

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
     *  uri: 接口路径(可选)，
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts){}, 支持数组(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: "_add",
    value: function _add() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var fn = opts.fn;

      if (!fn) {
        throw jmErr.err(Err.FA_PARAMS);
      } // fn 为数组时的处理


      if (Array.isArray(fn)) {
        var _fn = fn,
            length = _fn.length;

        if (!length) {
          // 数组为空时, 参数错误
          throw jmErr.err(Err.FA_PARAMS);
        } else if (length === 1) {
          // 数组只有一个元素时, 直接取出元素再处理
          fn = fn[0];
        } else {
          // 检查数组中是否存在对象，如果存在需要拆分后再添加
          for (var i = 0; i < fn.length; i++) {
            if (_typeof(fn[i]) === 'object') {
              if (i > 0) {
                this._add(_objectSpread2(_objectSpread2({}, opts), {}, {
                  fn: slice$1(fn, 0, i)
                }));
              }

              this._add(_objectSpread2(_objectSpread2({}, opts), {}, {
                fn: fn[i]
              }));

              if (i < fn.length - 1) {
                this._add(_objectSpread2(_objectSpread2({}, opts), {}, {
                  fn: slice$1(fn, i + 1)
                }));
              }

              return this;
            }
          }
        }
      }

      this.emit('add', opts);

      var o = _objectSpread2({}, opts);

      if (_typeof(fn) === 'object') {
        o.router = fn;
        var _fn2 = fn,
            request = _fn2.request,
            execute = _fn2.execute;

        if (request) {
          o.fn = request.bind(fn);
        } else if (execute) {
          o.fn = execute.bind(fn);
        }
      }

      o.uri || (o.uri = '/');
      if (o.sensitive === undefined) o.sensitive = this.sensitive;
      if (o.strict === undefined) o.strict = this.strict;
      var route$1 = new route(o);
      route$1.logging = this._logging;
      route$1.benchmark = this._benchmark;

      this._routes.push(route$1);

      return this;
    }
    /**
     * 添加接口定义, 精确匹配 uri
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
    key: "add",
    value: function add() {
      var opts = uniteParams$2.apply(void 0, arguments);
      return this._add(opts);
    }
    /**
     * 引用路由定义, 匹配所有 uri
     * use({uri:uri, fn:fn})
     * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
     * use({uri:uri, fn:router})
     * use({uri:uri, fn:obj}) obj必须实现了request或者execute函数之一，优先使用request
     * use(uri, fn)
     * use(uri, fn1, fn2, ..., fnn)
     * use(uri, [fn1, fn2, ..,fnn])
     * use(uri, router)
     * use(uri, obj)
     * use(fn)
     * use(router)
     * use(obj)
     * use(fn1, fn2, ..., fnn)
     * use([fn1, fn2, ..,fnn])
     * @function Router#use
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 接口路径(可选)
     *  fn: 接口处理函数 router实例 或者 function(opts){}(必填)
     * }
     * @return {Router} for chaining
     */

  }, {
    key: "use",
    value: function use() {
      var opts = uniteParams$2.apply(void 0, arguments);
      this.emit('use', opts);
      opts.strict = false;
      opts.end = false;
      return this.add(opts);
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
    key: "request",
    value: function request(opts) {
      try {
        var _exit2 = false;

        var _this2 = this,
            _arguments2 = arguments;

        var t1 = 0;

        if (_this2.logging) {
          if (_this2.benchmark) t1 = Date.now();
          var msg = 'Request';
          _this2.name && (msg += " ".concat(_this2.name));
          msg += " args: ".concat(JSON.stringify(opts));
          console.info(msg);
        }

        if (_typeof(opts) !== 'object') {
          opts = preRequest$1.apply(_this2, _arguments2);
        }

        var doc = null;
        return _continue(_catch(function () {
          return _await(_this2.execute(opts), function (_this$execute) {
            doc = _this$execute;
          });
        }, function (e) {
          return _await(_this2.emit('error', e, opts), function (ret) {
            if (ret === undefined) {
              throw e;
            }

            doc = ret;

            if (_this2.logging) {
              console.info('error catched, return', doc);
              console.error(e);
            }
          });
        }), function (_result) {
          if (_exit2) return _result;

          if (_this2.logging) {
            var _msg = 'Request';
            _this2.name && (_msg += " ".concat(_this2.name));
            if (doc !== undefined) _msg += " result: ".concat(JSON.stringify(doc));
            if (_this2.benchmark) _msg += " Elapsed time: ".concat(Date.now() - t1, "ms");
            console.info(_msg);
          }

          return doc;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "execute",
    value: function execute(opts) {
      try {
        var _exit4 = false;

        var _this4 = this;

        // restore obj props after function
        var restore = function restore(obj, baseUri, params) {
          return function () {
            obj.uri = obj.originalUri;
            obj.baseUri = baseUri;
            obj.params = params;
          };
        };

        var self = _this4;
        var routes = self.routes;
        var parentParams = opts.params;
        var parentUri = opts.baseUri || '';
        var done = restore(opts, opts.baseUri, opts.params);
        opts.originalUri || (opts.originalUri = opts.uri);
        var uri = opts.uri;
        var _i = 0,
            _len = routes.length;
        return _for(function () {
          return !_exit4 && _i < _len;
        }, function () {
          return _i++;
        }, function () {
          opts.baseUri = parentUri;
          opts.uri = uri;
          var route = routes[_i];

          if (!route) {
            return;
          }

          var match = route.match(opts);
          if (!match) return;
          opts.params = Object.assign({}, parentParams, match.params);

          if (route.router) {
            opts.baseUri = parentUri + match.uri;
            opts.uri = opts.uri.replace(match.uri, '');
          }

          return _await(route.execute(opts), function (doc) {
            done();

            if (doc !== undefined) {
              _exit4 = true;
              return doc;
            }
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * 快捷的路由增加方式
     * Router.route('/xx/xxxx')
     * .get
     * .post
     * .put
     * .delete
     * .use
     * .add
     * @param uri
     */

  }, {
    key: "route",
    value: function route(uri) {
      return new quickroute(this, uri);
    }
  }, {
    key: "logging",
    get: function get() {
      return this._logging;
    },
    set: function set(value) {
      this._logging = value;

      this._routes.forEach(function (route) {
        route.logging = value;
      });
    }
  }, {
    key: "benchmark",
    get: function get() {
      return this._benchmark;
    },
    set: function set(value) {
      this._benchmark = value;

      this._routes.forEach(function (route) {
        route.benchmark = value;
      });
    }
  }, {
    key: "routes",
    get: function get() {
      return this._routes;
    }
  }]);

  return Router;
}();

var router = Router;

var ERRCODE = 900;
var err = {
  FA_INVALID_TYPE: {
    err: ERRCODE++,
    msg: 'invalid type'
  }
};

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var getUriProtocol$1 = jmUtils.getUriProtocol;
/**
 * Class representing a root.
 */

function _async$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var Root = /*#__PURE__*/function () {
  /**
   * create a root.
   * @param {Object} opts 参数
   * @example
   * opts参数:{
   *  logging 是否打印日志，默认false
   *  benchmark 是否计算耗时，默认false
   * }
   */
  function Root() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Root);

    jmModule.enableModule(this);
    jmEvent.enableEvent(this);
    this.utils = utils;
    this.clientModules = {};
    this.serverModules = {};
    this.logging = opts.logging || false;
    this.benchmark = opts.benchmark || false;
  }
  /**
   * create a router
   * @param {Object} opts
   * @return {Router}
   */


  _createClass(Root, [{
    key: "router",
    value: function router$1() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var self = this;

      var _opts = Object.assign({}, {
        logging: this.logging,
        benchmark: this.benchmark
      }, opts);

      var app = new router(_opts);
      /**
       * 添加代理
       * proxy({uri:uri, target:target, changeOrigin:true})
       * proxy(uri, target, changeOrigin)
       * proxy(uri, target)
       * @param {String} uri
       * @param {String} target
       * @param {boolean} changeOrigin 是否改变原始uri
       */

      app.proxy = _async$1(function () {
        var _this = this;

        var uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var target = arguments.length > 1 ? arguments[1] : undefined;
        var changeOrigin = arguments.length > 2 ? arguments[2] : undefined;
        var opts = uri;

        if (typeof uri === 'string') {
          opts = {
            uri: uri,
            target: target,
            changeOrigin: changeOrigin
          };
        }

        if (!opts.target) {
          var doc = jmErr.Err.FA_PARAMS;
          var err = jmErr.err(doc);
          throw err;
        }

        _this.emit('proxy', opts);

        if (typeof opts.target === 'string') {
          opts.target = {
            uri: opts.target
          };
        }

        return _await$1(self.client(opts.target), function (client) {
          if (opts.changeOrigin) {
            app.use(opts.uri, client.request.bind(client));
          } else {
            app.use(opts.uri, client);
          }
        });
      });
      return app;
    }
    /**
     * create a client
     * @param {Object} opts
     * @example
     * opts参数:{
     *  type: 类型(可选, 默认http)
     *  uri: uri(可选, 默认http://127.0.0.1)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @return {Promise}
     */

  }, {
    key: "client",
    value: function client() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      try {
        var _this3 = this;

        if (typeof opts === 'string') {
          opts = {
            uri: opts
          };
        }

        if (!opts.uri) throw jmErr.err(jmErr.Err.FA_PARAMS);
        var err$1 = null;
        var doc = null;
        var type = 'http';
        opts.uri && (type = getUriProtocol$1(opts.uri));
        opts.type && (type = opts.type);
        type = type.toLowerCase();
        var fn = _this3.clientModules[type];

        if (!fn) {
          doc = err.FA_INVALID_TYPE;
          err$1 = jmErr.err(doc);
          throw err$1;
        }

        return _await$1(fn(opts), function (_fn) {
          doc = _fn;
          if (doc) utils.enableType(doc, ['get', 'post', 'put', 'delete']);
          return doc;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * create a server
     * @param {Object} app
     * @param {Object} opts
     * @example
     * opts参数:{
       *  uri: 网址(可选)
       *  type: 类型(可选, 默认http)
       *  host: 主机(可选, 默认127.0.0.1)
       *  port: 端口(可选, 默认80, 根据type不同默认值也不同)
       * }
     * @return {Promise}
     */

  }, {
    key: "server",
    value: function server() {
      var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        var _this5 = this;

        var err$1 = null;
        var doc = null;
        var type = 'http';
        opts.uri && (type = getUriProtocol$1(opts.uri));
        opts.type && (type = opts.type);
        type = type.toLowerCase();
        var fn = _this5.serverModules[type];

        if (!fn) {
          doc = err.FA_INVALID_TYPE;
          err$1 = jmErr.err(doc);
          throw err$1;
        }

        app.emit('server', opts);
        return _await$1(fn(app, opts), function (_fn2) {
          doc = _fn2;
          return doc;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * 创建一个代理路由
     * 支持多种参数格式, 例如
     * proxy({uri:uri})
     * proxy(uri)
     * @param {Object} opts 参数
     * @example
     * opts参数:{
       *  uri: 目标uri(必填)
       * }
     * @return {Promise}
     */

  }, {
    key: "proxy",
    value: function proxy() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      try {
        var _this7 = this;

        var err = null;
        var doc = null;

        if (typeof opts === 'string') {
          opts = {
            uri: opts
          };
        }

        if (!opts.uri) {
          doc = jmErr.Err.FA_PARAMS;
          err = jmErr.err(doc);
          throw err;
        }

        var app = _this7.router();

        return _await$1(_this7.client(opts), function (client) {
          app.use(client.request.bind(client));
          app.client = client;
          return app;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }]);

  return Root;
}();

Root.utils = utils;
var lib = Root;

module.exports = lib;
//# sourceMappingURL=index.js.map
