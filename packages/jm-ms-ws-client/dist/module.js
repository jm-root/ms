'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jmEvent = _interopDefault(require('jm-event'));
var jmLogger = _interopDefault(require('jm-logger'));
var jmMsCore = _interopDefault(require('jm-ms-core'));
var jmErr = _interopDefault(require('jm-err'));

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

var HeartBeat =
/*#__PURE__*/
function () {
  function HeartBeat() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HeartBeat);

    jmEvent.enableEvent(this);
    var _opts$pingTimeout = opts.pingTimeout,
        pingTimeout = _opts$pingTimeout === void 0 ? PingTimeout : _opts$pingTimeout,
        _opts$pongTimeout = opts.pongTimeout,
        pongTimeout = _opts$pongTimeout === void 0 ? PongTimeout : _opts$pongTimeout;
    this.pingTimeout = pingTimeout;
    this.pongTimeout = pongTimeout;
  }

  _createClass(HeartBeat, [{
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

var WebSocket =
/*#__PURE__*/
function () {
  function WebSocket() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebSocket);

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

  _createClass(WebSocket, [{
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
var ws = WebSocket;
var $ = {
  HeartBeat: heartbeat,
  WebSocket: ws
};
var lib = $;

var index_esm = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': lib
});

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var require$$1 = getCjsExportFromNamespace(index_esm);

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
var WS = require$$1.WebSocket;
var Err = jmErr.Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;
var errNetwork = jmErr.err(Err.FA_NETWORK);

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
    if (!uri) throw jmErr.err(jmErr.Err.FA_PARAMS);
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
                var e = jmErr.err(Err.FA_TIMEOUT);
                reject(e);
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
    jmEvent.enableEvent(doc, {
      async: true
    });

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
            err = jmErr.err(_doc);
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

exports.default = mdl;
//# sourceMappingURL=module.js.map
