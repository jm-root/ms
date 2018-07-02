'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _utils = require('jm-ms-core/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Err = _jmErr2.default.Err;

var MAXID = 999999;
var defaultPort = 3100;
var defaultUri = 'ws://localhost:' + defaultPort;
var errNetwork = _jmErr2.default.err(Err.FA_NETWORK);

var fnclient = function fnclient(fnCreateWS) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var doc, uri, timeout, id, cbs, path, prefix, ws, autoReconnect, reconnectTimer, reconnectionDelay, DEFAULT_MAX_RECONNECT_ATTEMPTS, maxReconnectAttempts, onmessage;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doc = null;
            uri = opts.uri || defaultUri;
            timeout = opts.timeout || 0;
            id = 0;
            cbs = {};
            path = _utils2.default.getUriPath(uri);
            prefix = opts.prefix || '';

            prefix = path + prefix;
            ws = null;
            autoReconnect = true;

            if (opts.reconnect === false) autoReconnect = false;
            reconnectTimer = null;
            reconnectionDelay = opts.reconnectionDelay || 5000;
            DEFAULT_MAX_RECONNECT_ATTEMPTS = 0; // 默认重试次数0 表示无限制

            maxReconnectAttempts = opts.reconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS;


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

              request: function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
                  var _args = arguments;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          opts = _utils2.default.preRequest.apply(this, _args);

                          if (this.connected) {
                            _context.next = 3;
                            break;
                          }

                          throw errNetwork;

                        case 3:
                          opts.uri = this.prefix + (opts.uri || '');
                          if (id >= MAXID) id = 0;
                          id++;
                          opts.id = id;
                          ws.send(JSON.stringify(opts));
                          return _context.abrupt('return', new Promise(function (resolve, reject) {
                            cbs[id] = {
                              resolve: resolve,
                              reject: reject
                            };
                          }));

                        case 9:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                function request(_x2) {
                  return _ref2.apply(this, arguments);
                }

                return request;
              }(),

              send: function send() {
                if (!this.connected) throw errNetwork;
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
            _jmEvent2.default.enableEvent(doc);

            onmessage = function onmessage(message) {
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
                    err = new Error(_doc.msg);
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
              var onopen = function onopen(event) {
                id = 0;
                cbs = {};
                self.connected = true;
                self.emit('open');
              };
              var onclose = function onclose(event) {
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
              };
              var onerror = function onerror(event) {
                doc.emit('error', event);
              };
              ws = fnCreateWS(this.uri, onmessage);
              ws.onopen = onopen;
              ws.onerror = onerror;
              ws.onclose = onclose;
            };
            doc.connect();
            return _context2.abrupt('return', doc);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
};

exports.default = fnclient;
module.exports = exports['default'];