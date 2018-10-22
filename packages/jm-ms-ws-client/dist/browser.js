'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var Err = jmErr.Err;
var errNetwork = jmErr.err(Err.FA_NETWORK);

var ws =
/*#__PURE__*/
function () {
  function Adapter(uri) {
    _classCallCheck(this, Adapter);

    var self = this;
    jmEvent.enableEvent(this);
    var ws = new WebSocket(uri);
    this.ws = ws;
    ws.on('message', function (event) {
      self.emit('message', event.data);
    });

    ws.onopen = function () {
      self.emit('open');
    };

    ws.onerror = function (event) {
      self.emit('error', event);
    };

    ws.onclose = function (event) {
      self.emit('close', event);
    };
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
}();

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  value = Promise.resolve(value);
  return then ? value.then(then) : value;
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
var utils = jmMsCore.utils;
var WS = jmNet.WebSocket;
var Err$1 = jmErr.Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;
var errNetwork$1 = jmErr.err(Err$1.FA_NETWORK);

var fnclient = function fnclient(_Adapter) {
  return _async(function () {
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
      request: _async(function (opts) {
        var _this = this,
            _arguments = arguments;

        return _await(_this.onReady(), function () {
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
                var e = jmErr.err(Err$1.FA_TIMEOUT);
                reject(e);
              }
            }, t);
          });
        });
      }),
      notify: _async(function (opts) {
        var _this2 = this,
            _arguments2 = arguments;

        return _await(_this2.onReady(), function () {
          opts = utils.preRequest.apply(_this2, _arguments2);
          if (!_this2.connected) throw errNetwork$1;
          opts.uri = _this2.prefix + (opts.uri || '');

          _this2.send(JSON.stringify(opts));
        });
      }),
      send: function send() {
        logger.debug.apply(logger, ['ws.send'].concat(Array.prototype.slice.call(arguments)));
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
      logger.debug('ws.received', message);
      onmessage(message);
    }).on('open', function () {
      id = 0;
      cbs = {};
      doc.emit('open');
      logger.info('ws.opened');
    }).on('error', function (e) {
      doc.emit('error', e);
      logger.error('ws.error', e);
    }).on('close', function (event) {
      doc.emit('close', event);
      logger.info('ws.closed');
    }).on('heartBeat', function () {
      if (doc.emit('heartBeat')) return true;
      doc.request('/', 'get').catch(function (e) {});
      return true;
    }).on('heartDead', function () {
      logger.info('ws.heartDead');
      return doc.emit('heartDead');
    }).on('connect', function () {
      doc.emit('connect');
      logger.info('ws.connect');
    }).on('reconnect', function () {
      doc.emit('reconnect');
      logger.info('ws.reconnect');
    }).on('connectFail', function () {
      doc.emit('connectFail');
      logger.info('ws.connectFail');
    });
    return doc;
  });
};

var fnclient_1 = fnclient;

var mdl = function mdl(Adapter) {
  var client = fnclient_1(Adapter);

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

var $ = mdl(ws);
var browser = $;

exports.default = browser;
//# sourceMappingURL=browser.js.map
