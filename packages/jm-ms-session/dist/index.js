'use strict';

var jmEvent = require('jm-event');
var jmMsCore = require('jm-ms-core');
var jmErr = require('jm-err');
var jmLogger = require('jm-logger');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var jmEvent__default = /*#__PURE__*/_interopDefaultLegacy(jmEvent);
var jmMsCore__default = /*#__PURE__*/_interopDefaultLegacy(jmMsCore);
var jmErr__default = /*#__PURE__*/_interopDefaultLegacy(jmErr);
var jmLogger__default = /*#__PURE__*/_interopDefaultLegacy(jmLogger);

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
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var _async = function () {
  try {
    if (isNaN.apply(null, {})) {
      return function (f) {
        return function () {
          try {
            return Promise.resolve(f.apply(this, arguments));
          } catch (e) {
            return Promise.reject(e);
          }
        };
      };
    }
  } catch (e) {}

  return function (f) {
    // Pre-ES5.1 JavaScript runtimes don't accept array-likes in Function.apply
    return function () {
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
}();

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

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

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  value = Promise.resolve(value);
  return then ? value.then(then) : value;
}
var EventEmitter = jmEvent__default['default'].EventEmitter;
var utils = jmMsCore__default['default'].utils;
var ms = new jmMsCore__default['default']();
var err = jmErr__default['default'].err,
    Err = jmErr__default['default'].Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;

var lib = /*#__PURE__*/function (_EventEmitter) {
  _inherits(lib, _EventEmitter);

  var _super = _createSuper(lib);

  function lib() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, lib);

    _this = _super.call(this);
    var _opts$debug = opts.debug,
        debug = _opts$debug === void 0 ? false : _opts$debug,
        _opts$timeout = opts.timeout,
        timeout = _opts$timeout === void 0 ? Timeout : _opts$timeout,
        _opts$logger = opts.logger,
        logger = _opts$logger === void 0 ? jmLogger__default['default'].logger : _opts$logger,
        _opts$router = opts.router,
        router = _opts$router === void 0 ? ms.router() : _opts$router;
    debug && (logger.level = 'debug');
    Object.assign(_assertThisInitialized(_this), {
      debug: debug,
      timeout: timeout,
      logger: logger,
      router: router
    });

    _this.reset();

    _this.on('message', _this.onMessage.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(lib, [{
    key: "reset",
    value: function reset() {
      Object.assign(this, {
        requestId: 0,
        cbs: {},
        timers: {}
      });
    }
  }, {
    key: "nextRequestId",
    value: function nextRequestId() {
      if (this.requestId >= MAXID) this.requestId = 0;
      return ++this.requestId;
    } // send request to remote

  }, {
    key: "request",
    value: function request(opts) {
      opts = utils.preRequest.apply(this, arguments);
      opts.id || (opts.id = this.nextRequestId());
      var cbs = this.cbs,
          timers = this.timers,
          defaultTimeout = this.timeout;
      var _opts = opts,
          id = _opts.id,
          _opts$timeout2 = _opts.timeout,
          timeout = _opts$timeout2 === void 0 ? defaultTimeout : _opts$timeout2;
      var p = new Promise(function (resolve, reject) {
        cbs[id] = {
          resolve: resolve,
          reject: reject
        };
        timers[id] = setTimeout(function () {
          delete timers[id];

          if (cbs[id]) {
            delete cbs[id];
            reject(err(Err.FA_TIMEOUT));
          }
        }, timeout);
      });
      this.send(JSON.stringify(opts));
      return p;
    } // send request to remote

  }, {
    key: "notify",
    value: function notify(opts) {
      opts = utils.preRequest.apply(this, arguments);
      this.send(JSON.stringify(opts));
    } // received request from remote and send response to remote

  }, {
    key: "onRequest",
    value: _async(function (opts) {
      var _this2 = this;

      var id = opts.id;
      var debug = _this2.debug,
          logger = _this2.logger;
      var data = null;
      return _continue(_catch(function () {
        return _await(_this2.router.request(opts), function (_this2$router$request) {
          data = _this2$router$request;

          if (debug) {
            logger.debug("ok. request:\n".concat(JSON.stringify(opts, null, 2), "\nresponse:\n").concat(JSON.stringify(data, null, 2)));
          }
        });
      }, function (e) {
        if (debug) {
          logger.debug("fail. request:\n".concat(JSON.stringify(opts, null, 2), "\nresponse:\n").concat(JSON.stringify(e.data, null, 2)));
        }

        logger.error(e);
        data = e.data;
        data || (data = Object.assign({
          status: e.status || Err.FA_INTERNALERROR.err
        }, Err.FA_INTERNALERROR, {
          msg: e.message
        }));
      }), function () {
        if (id) {
          _this2.send(JSON.stringify({
            id: id,
            data: data || {}
          }));
        }
      });
    }) // received response from remote

  }, {
    key: "onResponse",
    value: function onResponse(opts) {
      var id = opts.id,
          doc = opts.data;
      var p = this.cbs[id];
      if (!p) return;
      delete this.cbs[id];

      if (this.timers[id]) {
        clearTimeout(this.timers[id]);
        delete this.timers[id];
      }

      if (doc && doc.err) {
        p.reject(err(doc));
      } else {
        p.resolve(doc);
      }
    }
  }, {
    key: "onMessage",
    value: function onMessage(message) {
      this.debug && this.logger.debug("message received: ".concat(message));
      var json = null;

      try {
        json = JSON.parse(message);
      } catch (err) {
        return;
      }

      var _json = json,
          id = _json.id,
          uri = _json.uri; // received request or notify

      if (uri) {
        return this.onRequest(json);
      } // received response


      if (id) {
        return this.onResponse(json);
      }
    }
  }, {
    key: "send",
    value: function send() {
      throw new Error('method send not implemented.');
    }
  }]);

  return lib;
}(EventEmitter);

module.exports = lib;
//# sourceMappingURL=index.js.map
