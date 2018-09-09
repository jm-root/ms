(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jm-event'), require('jm-err'), require('jm-ms-core')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jm-event', 'jm-err', 'jm-ms-core'], factory) :
  (factory((global['jm-ms-ws-client'] = {}),global.jmEvent,global.jmErr,global.jmMsCore));
}(this, (function (exports,jmEvent,jmErr,jmMsCore) { 'use strict';

  jmEvent = jmEvent && jmEvent.hasOwnProperty('default') ? jmEvent['default'] : jmEvent;
  jmErr = jmErr && jmErr.hasOwnProperty('default') ? jmErr['default'] : jmErr;
  jmMsCore = jmMsCore && jmMsCore.hasOwnProperty('default') ? jmMsCore['default'] : jmMsCore;

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
  var Err$1 = jmErr.Err;
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

      if (!opts.uri) throw jmErr.err(jmErr.Err.FA_PARAMS);
      var Adapter = opts.Adapter || _Adapter;
      var doc = null;
      var uri = opts.uri;
      var timeout = opts.timeout || 0;
      var id = 0;
      var cbs = {};
      var path = utils.getUriPath(uri);
      var prefix = opts.prefix || '';
      prefix = path + prefix;
      var ws = null;
      var autoReconnect = true;
      if (opts.reconnect === false) autoReconnect = false;
      var reconnectTimer = null;
      var reconnectionDelay = opts.reconnectionDelay || 5000;
      var DEFAULT_MAX_RECONNECT_ATTEMPTS = 0; // 默认重试次数0 表示无限制

      var maxReconnectAttempts = opts.reconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS;
      doc = {
        uri: uri,
        prefix: prefix,
        connected: false,
        autoReconnect: autoReconnect,
        reconnectAttempts: 0,
        reconnectionDelay: reconnectionDelay,
        maxReconnectAttempts: maxReconnectAttempts,
        onReady: function onReady() {
          var self = this;
          return new Promise(function (resolve, reject) {
            if (self.connected) return resolve(self.connected);
            self.on('open', function () {
              resolve(self.connected);
            });
          });
        },
        request: _async(function (opts) {
          var _this = this,
              _arguments = arguments;

          return _await(_this.onReady(), function () {
            opts = utils.preRequest.apply(_this, _arguments);
            if (!_this.connected) throw errNetwork$1;
            opts.uri = _this.prefix + (opts.uri || '');
            if (id >= MAXID) id = 0;
            id++;
            opts.id = id;
            ws.send(JSON.stringify(opts));
            return new Promise(function (resolve, reject) {
              cbs[id] = {
                resolve: resolve,
                reject: reject
              };
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
            ws.send(JSON.stringify(opts));
          });
        }),
        send: function send() {
          if (!this.connected) throw errNetwork$1;
          ws.send.apply(ws, arguments);
        },
        close: function close() {
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
          }

          this.autoReconnect = false;
          this.reconnectAttempts = 0;
          if (!this.connected) return;
          ws.close();
          ws = null;
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

      doc.connect = function () {
        if (this.connected) return;
        if (ws) return;
        this.autoReconnect = autoReconnect;
        doc.emit('connect');
        var self = doc;
        ws = new Adapter(this.uri);
        ws.on('message', function (message) {
          onmessage(message);
        });
        ws.on('open', function () {
          id = 0;
          cbs = {};
          self.connected = true;
          self.emit('open');
        });
        ws.on('error', function (event) {
          doc.emit('error', event);
        });
        ws.on('close', function (event) {
          self.connected = false;
          ws = null;
          self.emit('close', event);

          if (self.autoReconnect) {
            if (self.maxReconnectAttempts && self.reconnectAttempts >= self.maxReconnectAttempts) {
              self.emit('connectFail');
              return;
            }

            self.reconnectAttempts++;
            self.emit('reconnect');
            reconnectTimer = setTimeout(function () {
              reconnectTimer = null;
              self.connect();
            }, self.reconnectionDelay);
          }
        });
      };

      doc.connect();
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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jm-ms-ws-client.browser.js.map
