import jmEvent from 'jm-event';
import ws$2 from 'ws';
import jmLogger from 'jm-logger';
import jmMsCore from 'jm-ms-core';

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

var EventEmitter = jmEvent.EventEmitter;

var ws = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Adapter, _EventEmitter);

  var _super = _createSuper(Adapter);

  function Adapter(uri) {
    var _this;

    _classCallCheck(this, Adapter);

    _this = _super.call(this, {
      async: true
    });
    var ws = new ws$2(uri);
    _this.ws = ws;
    ws.on('message', function (data, flags) {
      _this.emit('message', data);
    });

    ws.onopen = function () {
      _this.emit('open');
    };

    ws.onerror = function (event) {
      _this.emit('error', event);
    };

    ws.onclose = function (event) {
      _this.emit('close', event);
    };

    return _this;
  }

  _createClass(Adapter, [{
    key: "send",
    value: function send() {
      var _this$ws;

      (_this$ws = this.ws).send.apply(_this$ws, arguments);
    }
  }, {
    key: "close",
    value: function close() {
      var _this$ws2;

      if (!this.ws) return;

      (_this$ws2 = this.ws).close.apply(_this$ws2, arguments);
    }
  }]);

  return Adapter;
}(EventEmitter);

var zh_CN = {
  'Success': '成功',
  'Fail': '失败',
  'System Error': '系统错误',
  'Network Error': '网络错误',
  'Parameter Error': '参数错误',
  'Busy': '忙',
  'Time Out': '超时',
  'Abort': '中止',
  'Not Ready': '未准备好',
  'Not Exists': '不存在',
  'Already Exists': '已存在',
  'Validation Error': '校验错误',
  'OK': 'OK',
  'Bad Request': '错误请求',
  'Unauthorized': '未验证',
  'Forbidden': '无权限',
  'Not Found': '未找到',
  'Internal Server Error': '服务器内部错误',
  'Service Unavailable': '无效服务'
};
var lngs = {
  zh_CN: zh_CN
  /**
   * translate
   * @param {string} msg - msg to be translate
   * @param {string} lng - language
   * @return {String | null}
   */

};

var locale = function locale(msg, lng) {
  if (!lng || !lngs[lng]) return null;
  return lngs[lng][msg];
};
/**
 * err module.
 * @module err
 */


function isNumber(obj) {
  return typeof obj === 'number' && isFinite(obj);
}
/**
 * common error defines
 *
 */


var Err = {
  SUCCESS: {
    err: 0,
    msg: 'Success'
  },
  FAIL: {
    err: 1,
    msg: 'Fail'
  },
  FA_SYS: {
    err: 2,
    msg: 'System Error'
  },
  FA_NETWORK: {
    err: 3,
    msg: 'Network Error'
  },
  FA_PARAMS: {
    err: 4,
    msg: 'Parameter Error'
  },
  FA_BUSY: {
    err: 5,
    msg: 'Busy'
  },
  FA_TIMEOUT: {
    err: 6,
    msg: 'Time Out'
  },
  FA_ABORT: {
    err: 7,
    msg: 'Abort'
  },
  FA_NOTREADY: {
    err: 8,
    msg: 'Not Ready'
  },
  FA_NOTEXISTS: {
    err: 9,
    msg: 'Not Exists'
  },
  FA_EXISTS: {
    err: 10,
    msg: 'Already Exists'
  },
  FA_VALIDATION: {
    err: 11,
    msg: 'Validation Error'
  },
  OK: {
    err: 200,
    msg: 'OK'
  },
  FA_BADREQUEST: {
    err: 400,
    msg: 'Bad Request'
  },
  FA_NOAUTH: {
    err: 401,
    msg: 'Unauthorized'
  },
  FA_NOPERMISSION: {
    err: 403,
    msg: 'Forbidden'
  },
  FA_NOTFOUND: {
    err: 404,
    msg: 'Not Found'
  },
  FA_INTERNALERROR: {
    err: 500,
    msg: 'Internal Server Error'
  },
  FA_UNAVAILABLE: {
    err: 503,
    msg: 'Service Unavailable'
  }
};
Err.t = locale;
/**
 * return message from template
 *
 * ```javascript
 * errMsg('sampe ${name} ${value}', {name: 'jeff', value: 123});
 * // return 'sample jeff 123'
 * ```
 *
 * @param {String} msg message template
 * @param {Object} opts params
 * @return {String} final message
 */

function errMsg(msg, opts) {
  if (opts) {
    for (var key in opts) {
      msg = msg.split('${' + key + '}').join(opts[key]);
    }
  }

  return msg;
}
/**
 * return an Error Object
 * @param {Object|String} E Err object or a message template
 * @param {Object} [opts] params
 * @return {Error}
 */


function err(E, opts) {
  if (typeof E === 'string') {
    E = {
      msg: E
    };
  }

  var msg = errMsg(E.msg || E.message, opts);
  var code = E.err;
  code === undefined && (code = Err.FAIL.err);
  var status = Err.FA_INTERNALERROR.err;
  if (code === Err.SUCCESS.err) status = 200;
  if (isNumber(code) && code >= 200 && code <= 600) status = code;
  E.status !== undefined && (status = E.status);
  var e = new Error(msg);
  e.code = code;
  e.status = status;
  e.data = Object.assign(E, {
    err: code,
    msg: msg,
    status: status
  });
  return e;
}
/**
 * enable Err Object, errMsg and err function for obj
 * @param {Object} obj target object
 * @param {String} [name] name to bind
 * @return {boolean}
 */


function enableErr(obj) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';
  if (obj[name]) return false;
  obj[name] = Err;
  obj.err = err;
  obj.errMsg = errMsg;
  return true;
}
/**
 * disable Err Object, errMsg and err function for obj
 * @param {Object} obj target object
 * @param {String} [name] name to bind
 */


function disableErr(obj) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';
  if (!obj[name]) return;
  delete obj[name];
  delete obj.err;
  delete obj.errMsg;
}

var $ = {
  Err: Err,
  errMsg: errMsg,
  err: err,
  enableErr: enableErr,
  disableErr: disableErr
};
var lib = $;

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var PingTimeout = 60000; // 默认心跳时间 60 秒

var PongTimeout = 10000; // 默认响应超时时间 10 秒

var HeartBeat = /*#__PURE__*/function () {
  function HeartBeat() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$1(this, HeartBeat);

    jmEvent.enableEvent(this);
    var _opts$pingTimeout = opts.pingTimeout,
        pingTimeout = _opts$pingTimeout === void 0 ? PingTimeout : _opts$pingTimeout,
        _opts$pongTimeout = opts.pongTimeout,
        pongTimeout = _opts$pongTimeout === void 0 ? PongTimeout : _opts$pongTimeout;
    this.pingTimeout = pingTimeout;
    this.pongTimeout = pongTimeout;
  }

  _createClass$1(HeartBeat, [{
    key: "reset",
    value: function reset() {
      this.stop();
      this.start();
      return this;
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      var pingTimeout = this.pingTimeout,
          pongTimeout = this.pongTimeout;
      this.pingTimer = setTimeout(function () {
        if (_this.emit('heartBeat')) {
          _this.pongTimer = setTimeout(function () {
            _this.emit('heartDead');
          }, pongTimeout);
        }
      }, pingTimeout);
      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.pingTimer && clearTimeout(this.pingTimer);
      this.pongTimer && clearTimeout(this.pongTimer);
      return this;
    }
  }]);

  return HeartBeat;
}();

HeartBeat.PingTimeout = PingTimeout;
HeartBeat.PongTimeout = PongTimeout;
var heartbeat = HeartBeat;

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

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  value = Promise.resolve(value);
  return then ? value.then(then) : value;
}

var PingFailedCode = 4999; // 心跳失败后，关闭 code, 4000 至 4999 之间

var MaxReconnectAttempts = 0; // 默认重试次数0 表示无限制

var ReconnectTimeout = 3000; // 默认自动重连延时 3 秒

var WebSocket = /*#__PURE__*/function () {
  function WebSocket() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$1(this, WebSocket);

    jmEvent.enableEvent(this);
    var Adapter = opts.Adapter,
        _opts$timeout = opts.timeout,
        _opts$reconnect = opts.reconnect,
        reconnect = _opts$reconnect === void 0 ? true : _opts$reconnect,
        _opts$reconnectTimeou = opts.reconnectTimeout,
        reconnectTimeout = _opts$reconnectTimeou === void 0 ? ReconnectTimeout : _opts$reconnectTimeou,
        _opts$reconnectAttemp = opts.reconnectAttempts,
        reconnectAttempts = _opts$reconnectAttemp === void 0 ? MaxReconnectAttempts : _opts$reconnectAttemp,
        _opts$pingFailedCode = opts.pingFailedCode,
        pingFailedCode = _opts$pingFailedCode === void 0 ? PingFailedCode : _opts$pingFailedCode;
    if (!Adapter) throw new Error('invalid Adapter');
    this.Adapter = Adapter;
    this.pingFailedCode = pingFailedCode;
    this.reconnect = reconnect;
    this.reconnectTimeout = reconnectTimeout;
    this.maxReconnectAttempts = reconnectAttempts;
    this.reconnectAttempts = 0;
    this._reconnectTimer = null;
    this.uri = null;
    this.ws = null;
    this.connecting = null; // or a promise instance

    var heart = new heartbeat(opts);
    this.heart = heart;
    heart.on('heartBeat', function () {
      return _this.emit('heartBeat');
    }).on('heartDead', function () {
      if (_this.emit('heartDead')) return;

      _this.close(_this.pingFailedCode, 'heartbeat timeout');
    });
  }

  _createClass$1(WebSocket, [{
    key: "onReady",
    value: function onReady() {
      if (this.ws) return;
      return this.connect();
    }
  }, {
    key: "connect",
    value: function connect(uri) {
      uri && (this.uri = uri);

      if (!this.connecting) {
        this.connecting = this._connect();
      }

      return this.connecting;
    }
  }, {
    key: "send",
    value: _async(function () {
      var _this2 = this,
          _arguments = arguments;

      return _await(_this2.onReady(), function () {
        try {
          var _this2$ws;

          (_this2$ws = _this2.ws).send.apply(_this2$ws, _toConsumableArray(_arguments));

          _this2.heart.reset();
        } catch (e) {
          throw e;
        }
      });
    })
  }, {
    key: "close",
    value: function close() {
      var _this$ws;

      this._stopReconnect();

      if (!this.ws) return;

      (_this$ws = this.ws).close.apply(_this$ws, arguments);

      this.ws = null;
      this.connecting = null;
    }
  }, {
    key: "_connect",
    value: _async(function () {
      var _this3 = this;

      var uri = _this3.uri;
      if (!uri) throw new Error('invalid uri');
      if (_this3.ws) return;

      _this3.emit('connect');

      return new Promise(function (resolve, reject) {
        var ws = null;

        try {
          ws = new _this3.Adapter(uri);
        } catch (e) {
          return reject(e);
        }

        ws.on('message', function (opts) {
          _this3.heart.reset();

          _this3.emit('message', opts);
        }).on('open', function (opts) {
          _this3.emit('open', opts);

          _this3.ws = ws;
          _this3.connecting = null;

          _this3.heart.reset();

          _this3._stopReconnect();

          resolve();
        }).on('error', function (e) {
          _this3.emit('error', e);

          reject(e);
        }).on('close', function (opts) {
          _this3.emit('close', opts);

          _this3.heart.stop();

          _this3.ws = null;
          _this3.connecting = null;
          var _opts$wasClean = opts.wasClean,
              wasClean = _opts$wasClean === void 0 ? true : _opts$wasClean,
              code = opts.code;
          if (wasClean && code !== _this3.pingFailedCode) return;

          if (_this3.reconnect) {
            _this3._reconnect();
          }
        });
      });
    })
  }, {
    key: "_reconnect",
    value: function _reconnect() {
      var _this4 = this;

      if (this.maxReconnectAttempts && this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connectFail');

        this._stopReconnect();

        return;
      }

      this.reconnectAttempts++;
      this.emit('reconnect');
      this._reconnectTimer = setTimeout(function () {
        _this4._reconnectTimer = null;

        _this4.connect()["catch"](function () {});
      }, this.reconnectTimeout);
    }
  }, {
    key: "_stopReconnect",
    value: function _stopReconnect() {
      if (this._reconnectTimer) {
        clearTimeout(this._reconnectTimer);
        this._reconnectTimer = null;
      }

      this.reconnectAttempts = 0;
    }
  }, {
    key: "ready",
    get: function get() {
      return this.ws ? true : false;
    }
  }]);

  return WebSocket;
}();

WebSocket.MaxReconnectAttempts = MaxReconnectAttempts;
WebSocket.ReconnectTimeout = ReconnectTimeout;
WebSocket.PingFailedCode = PingFailedCode;
var ws$1 = WebSocket;
var $$1 = {
  HeartBeat: heartbeat,
  WebSocket: ws$1
};
var lib$1 = $$1;

var _async$1 = function () {
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

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  value = Promise.resolve(value);
  return then ? value.then(then) : value;
}
var utils = jmMsCore.utils;
var WS = lib$1.WebSocket;
var Err$1 = lib.Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;
var errNetwork = lib.err(Err$1.FA_NETWORK);

var fnclient = function fnclient(_Adapter) {
  return function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof opts === 'string') {
      opts = {
        uri: opts
      };
    }

    var _opts = opts,
        uri = _opts.uri,
        _opts$timeout = _opts.timeout,
        timeout = _opts$timeout === void 0 ? Timeout : _opts$timeout,
        _opts$logger = _opts.logger,
        logger = _opts$logger === void 0 ? jmLogger.logger : _opts$logger;
    var _opts2 = opts,
        _opts2$prefix = _opts2.prefix,
        prefix = _opts2$prefix === void 0 ? '' : _opts2$prefix;
    if (!uri) throw lib.err(lib.Err.FA_PARAMS);
    var path = utils.getUriPath(uri);
    prefix = path + prefix;
    var id = 0;
    var cbs = {};
    var ws = new WS(Object.assign({
      Adapter: _Adapter
    }, opts));
    ws.connect(uri);
    var doc = {
      uri: uri,
      prefix: prefix,
      onReady: function onReady() {
        return ws.onReady();
      },
      request: _async$1(function (opts) {
        var _this = this,
            _arguments = arguments;

        return _await$1(_this.onReady(), function () {
          opts = utils.preRequest.apply(_this, _arguments);
          opts.uri = _this.prefix + (opts.uri || '');
          if (id >= MAXID) id = 0;
          id++;
          opts.id = id;

          _this.send(JSON.stringify(opts));

          return new Promise(function (resolve, reject) {
            cbs[id] = {
              resolve: resolve,
              reject: reject
            };
            var t = opts.timeout || timeout;
            setTimeout(function () {
              if (cbs[id]) {
                delete cbs[id];

                var _e = lib.err(Err$1.FA_TIMEOUT);

                reject(_e);
              }
            }, t);
          });
        });
      }),
      notify: _async$1(function (opts) {
        var _this2 = this,
            _arguments2 = arguments;

        return _await$1(_this2.onReady(), function () {
          opts = utils.preRequest.apply(_this2, _arguments2);
          if (!_this2.connected) throw errNetwork;
          opts.uri = _this2.prefix + (opts.uri || '');

          _this2.send(JSON.stringify(opts));
        });
      }),
      send: function send() {
        ws.send.apply(ws, arguments);
      },
      close: function close() {
        ws.close();
      }
    };
    jmEvent.enableEvent(doc);

    var onmessage = function onmessage(message) {
      doc.emit('message', message);
      var json = null;

      try {
        json = JSON.parse(message);
      } catch (err) {
        return;
      }

      if (json.id) {
        if (cbs[json.id]) {
          var p = cbs[json.id];
          var err = null;
          var _doc = json.data;

          if (_doc.err) {
            err = lib.err(_doc);
            p.reject(err);
          } else {
            p.resolve(_doc);
          }

          delete cbs[json.id];
        }
      }
    };

    ws.on('message', function (message) {
      onmessage(message);
    }).on('open', function () {
      id = 0;
      cbs = {};
      doc.emit('open');
      logger.info('ws.opened', uri);
    }).on('error', function (e) {
      doc.emit('error', e);
      logger.error('ws.error', uri);
      logger.error(e);
    }).on('close', function (event) {
      doc.emit('close', event);
      logger.info('ws.closed', uri);
    }).on('heartBeat', function () {
      if (doc.emit('heartBeat')) return true;
      doc.request('/', 'get')["catch"](function (e) {});
      return true;
    }).on('heartDead', function () {
      logger.info('ws.heartDead', uri);
      return doc.emit('heartDead');
    }).on('connect', function () {
      doc.emit('connect');
      logger.info('ws.connect', uri);
    }).on('reconnect', function () {
      doc.emit('reconnect');
      logger.info('ws.reconnect', uri);
    }).on('connectFail', function () {
      doc.emit('connectFail');
      logger.info('ws.connectFail', uri);
    });
    return doc;
  };
};

var mdl = function mdl(Adapter) {
  var client = fnclient(Adapter);

  var $ = function $() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-ws-client';
    var app = this;
    app.clientModules.ws = client;
    app.clientModules.wss = client;
    return {
      name: name,
      unuse: function unuse() {
        delete app.clientModules.ws;
        delete app.clientModules.wss;
      }
    };
  };

  $.client = client;
  return $;
};

var lib$2 = mdl(ws);

export default lib$2;
//# sourceMappingURL=module.esm.js.map
