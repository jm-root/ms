'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jmEvent = _interopDefault(require('jm-event'));
var jmErr = _interopDefault(require('jm-err'));
var jmLogger = _interopDefault(require('jm-logger'));
var jmMsCore = _interopDefault(require('jm-ms-core'));
var jmNet = _interopDefault(require('jm-net'));

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
var Err = jmErr.Err;
var errNetwork = jmErr.err(Err.FA_NETWORK);

var ws = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Adapter, _EventEmitter);

  var _super = _createSuper(Adapter);

  function Adapter(uri) {
    var _this;

    _classCallCheck(this, Adapter);

    _this = _super.call(this, {
      async: true
    });
    var ws = new WebSocket(uri); // eslint-disable-line

    _this.ws = ws;

    ws.onmessage = function (event) {
      _this.emit('message', event.data);
    };

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
      if (!this.ws) throw errNetwork;
      this.ws.send.apply(this.ws, arguments);
    }
  }, {
    key: "close",
    value: function close() {
      if (!this.ws) throw errNetwork;
      this.ws.close.apply(this.ws, arguments);
    }
  }]);

  return Adapter;
}(EventEmitter);

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var utils = jmMsCore.utils;
var WS = jmNet.WebSocket;
var Err$1 = jmErr.Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;
var errNetwork$1 = jmErr.err(Err$1.FA_NETWORK);

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
      request: function request(opts) {
        try {
          var _this2 = this,
              _arguments2 = arguments;

          return _await(_this2.onReady(), function () {
            opts = utils.preRequest.apply(_this2, _arguments2);
            opts.uri = _this2.prefix + (opts.uri || '');
            if (id >= MAXID) id = 0;
            id++;
            opts.id = id;

            _this2.send(JSON.stringify(opts));

            return new Promise(function (resolve, reject) {
              cbs[id] = {
                resolve: resolve,
                reject: reject
              };
              var t = opts.timeout || timeout;
              setTimeout(function () {
                if (cbs[id]) {
                  delete cbs[id];

                  var _e = jmErr.err(Err$1.FA_TIMEOUT);

                  reject(_e);
                }
              }, t);
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      notify: function notify(opts) {
        try {
          var _this4 = this,
              _arguments4 = arguments;

          return _await(_this4.onReady(), function () {
            opts = utils.preRequest.apply(_this4, _arguments4);
            if (!_this4.connected) throw errNetwork$1;
            opts.uri = _this4.prefix + (opts.uri || '');

            _this4.send(JSON.stringify(opts));
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
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

var browser = mdl(ws);

module.exports = browser;
//# sourceMappingURL=browser.js.map
