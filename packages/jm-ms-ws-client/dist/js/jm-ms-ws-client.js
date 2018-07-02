(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fnclient = require('../core/fnclient');

var _fnclient2 = _interopRequireDefault(_fnclient);

var _ws = require('./ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = (0, _fnclient2.default)(_ws2.default);
exports.default = client;
module.exports = exports['default'];
},{"../core/fnclient":4,"./ws":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _mdl = require('../core/mdl');

var _mdl2 = _interopRequireDefault(_mdl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = (0, _mdl2.default)(_client2.default);
$.client = _client2.default;
exports.default = $;
module.exports = exports['default'];
},{"../core/mdl":5,"./client":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Err = _jmErr2.default.Err;
var errNetwork = _jmErr2.default.err(Err.FA_NETWORK);

var Adapter = function () {
  function Adapter(uri) {
    _classCallCheck(this, Adapter);

    var self = this;
    _jmEvent2.default.enableEvent(this);
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
    key: 'send',
    value: function send() {
      if (!this.ws) throw errNetwork;
      this.ws.send.apply(this.ws, arguments);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.ws) throw errNetwork;
      this.ws.close.apply(this.ws, arguments);
    }
  }]);

  return Adapter;
}();

exports.default = Adapter;
module.exports = exports['default'];
},{"jm-err":6,"jm-event":9}],4:[function(require,module,exports){
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

var fnclient = function fnclient(_Adapter) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var Adapter, doc, uri, timeout, id, cbs, path, prefix, ws, autoReconnect, reconnectTimer, reconnectionDelay, DEFAULT_MAX_RECONNECT_ATTEMPTS, maxReconnectAttempts, onmessage;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            Adapter = opts.Adapter || _Adapter;
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
            return _context2.abrupt('return', doc);

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
};

exports.default = fnclient;
module.exports = exports['default'];
},{"jm-err":6,"jm-event":9,"jm-ms-core/lib/utils":10}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (client) {
  var $ = function $() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-ws-client';

    var app = this;
    app.clientModules.ws = client;

    return {
      name: name,
      unuse: function unuse() {
        delete app.clientModules.ws;
      }
    };
  };

  if (typeof global !== 'undefined' && global) {
    global.jm || (global.jm = {});
    var jm = global.jm;
    if (jm.ms) {
      jm.ms.root.use($);
    }
  }

  return $;
};

module.exports = exports['default'];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _locale = require('./locale');

var _locale2 = _interopRequireDefault(_locale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    err: 8,
    msg: 'Already Exists'
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
}; /**
    * err module.
    * @module err
    */

Err.t = _locale2.default;

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
var errMsg = function errMsg(msg, opts) {
  if (opts) {
    for (var key in opts) {
      msg = msg.split('${' + key + '}').join(opts[key]);
    }
  }
  return msg;
};

/**
 * return an Error Object
 * @param {Object|String} E Err object or a message template
 * @param {Object} [opts] params
 * @return {Error}
 */
var err = function err(E, opts) {
  if (typeof E === 'string') {
    E = {
      msg: E
    };
  }
  var msg = errMsg(E.msg, opts);
  var e = new Error(msg);
  E.err && (e.code = E.err);
  return e;
};

/**
 * enable Err Object, errMsg and err function for obj
 * @param {Object} obj target object
 * @param {String} [name] name to bind
 * @return {boolean}
 */
var enableErr = function enableErr(obj) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';

  if (obj[name]) return false;
  obj[name] = Err;
  obj.err = err;
  obj.errMsg = errMsg;
  return true;
};

/**
 * disable Err Object, errMsg and err function for obj
 * @param {Object} obj target object
 * @param {String} [name] name to bind
 */
var disableErr = function disableErr(obj) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';

  if (!obj[name]) return;
  delete obj[name];
  delete obj.err;
  delete obj.errMsg;
};

var $ = {
  Err: Err,
  errMsg: errMsg,
  err: err,
  enableErr: enableErr,
  disableErr: disableErr
};

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {});
  var jm = global.jm;
  if (!jm.enableErr) {
    enableErr(jm);
    for (var key in $) {
      jm[key] = $[key];
    }
  }
}

exports.default = $;
module.exports = exports['default'];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./locale":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (msg, lng) {
  if (!lng || !lngs[lng]) return null;
  return lngs[lng][msg];
};

var _zh_CN = require('./zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lngs = {
  zh_CN: _zh_CN2.default

  /**
   * translate
   * @param {string} msg - msg to be translate
   * @param {string} lng - language
   * @return {String | null}
   */
};;
module.exports = exports['default'];
},{"./zh_CN":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
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
  'OK': 'OK',
  'Bad Request': '错误请求',
  'Unauthorized': '未验证',
  'Forbidden': '无权限',
  'Not Found': '未找到',
  'Internal Server Error': '服务器内部错误',
  'Service Unavailable': '无效服务'
};
module.exports = exports['default'];
},{}],9:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * event module.
 * @module event
 */

/**
 * Class representing an eventEmitter.
 *
 * ```javascript
 * // es6
 * let eventEmitter = new EventEmitter();
 * eventEmitter.on('test', (info) => {
 *      console.log(info);
 * });
 * eventEmitter.once('test', (info) => {
 *      // this will be called only one time
 *      console.log(info);
 * });
 * eventEmitter.one('test', (info) => {
 *      // this will be called first
 *      console.log(info);
 * }, true);
 *
 * eventEmitter.emit('test', 'hello eventEmitter');
 * eventEmitter.off('test');
 * ```
 */
var EventEmitter = function () {
  /**
     * Create an eventEmitter.
     */
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._events = {};
  }

  /**
     * Adds the listener function to the end of the listeners array for the event named eventName.
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
     *
     * @param {*} eventName - event name
     * @param {Function} fn - listener function
     * @param {boolean} [prepend] - Adds to the beginning of the listeners array if true
     * @return {EventEmitter} - for chaining
     */


  _createClass(EventEmitter, [{
    key: 'on',
    value: function on(eventName, fn, prepend) {
      this._events[eventName] || (this._events[eventName] = []);
      if (prepend) {
        this._events[eventName].unshift(fn);
      } else {
        this._events[eventName].push(fn);
      }
      return this;
    }

    /**
       * Adds a one time listener function for the event named eventName.
       * The next time eventName is triggered, this listener is removed and then invoked.
       *
       * @param {*} eventName - event name
       * @param {Function} fn - listener function
       * @param {boolean} [prepend] - Adds to the beginning of the listeners array if true
       * @return {EventEmitter} - for chaining
       */

  }, {
    key: 'once',
    value: function once(eventName, fn, prepend) {
      var _this = this;

      var on = function on(arg1, arg2, arg3, arg4, arg5) {
        _this.off(eventName, on);
        fn(arg1, arg2, arg3, arg4, arg5);
      };
      return this.on(eventName, on, prepend);
    }

    /**
       * Removes a listener for the event named eventName.
       * Removes all listeners from the listener array for event named eventName if fn is null
       * Removes all listeners from the listener array if eventName is null
       *
       * @param {*} [eventName] - event name
       * @param {Function} [fn] - listener function
       * @return {EventEmitter} - for chaining
       */

  }, {
    key: 'off',
    value: function off(eventName, fn) {
      if (!fn) {
        if (eventName === undefined) {
          this._events = {};
        } else if (this._events && this._events[eventName]) {
          delete this._events[eventName];
        }
      } else if (this._events && this._events[eventName]) {
        var list = this._events[eventName];
        for (var i = 0; i < list.length; i++) {
          if (fn === list[i]) {
            list.splice(i, 1);
            if (!list.length) {
              delete this._events[eventName];
            }
            break;
          }
        }
      }
      return this;
    }

    /**
       * Synchronously calls each of the listeners registered for the event named eventName,
       * in the order they were registered, passing the supplied arguments to each.
       *
       * to break the calls, just return false on listener function.
       * ```javascript
       * // es6
       * let eventEmitter = new EventEmitter();
       * eventEmitter.on('test', (info) => {
       *      // this will be called
       *      console.log(info);
       * });
       * eventEmitter.on('test', (info) => {
       *      // this will be called
       *      return false;  // this break the calls
       * });
       * eventEmitter.on('test', (info) => {
       *      // this will not be called.
       *      console.log(info);
       * });
       * eventEmitter.emit('test', 'hello eventEmitter');
       * ```
       * tip: use arg1...arg5 instead of arguments for performance consider.
       *
       * @param {*} eventName - event name
       * @param {*} arg1
       * @param {*} arg2
       * @param {*} arg3
       * @param {*} arg4
       * @param {*} arg5
       * @return {EventEmitter} - for chaining
       */

  }, {
    key: 'emit',
    value: function emit(eventName, arg1, arg2, arg3, arg4, arg5) {
      // using a copy to avoid error when listener array changed
      var listeners = this.listeners(eventName);
      for (var i = 0; i < listeners.length; i++) {
        var fn = listeners[i];
        if (fn(arg1, arg2, arg3, arg4, arg5) === false) break;
      }
      return this;
    }

    /**
       * Returns an array listing the events for which the emitter has registered listeners.
       * The values in the array will be strings or Symbols.
       * @return {Array}
       */

  }, {
    key: 'eventNames',
    value: function eventNames() {
      return Object.keys(this._events);
    }

    /**
       * Returns a copy of the array of listeners for the event named eventName.
       * @param {*} eventName - event name
       * @return {Array} - listener array
       */

  }, {
    key: 'listeners',
    value: function listeners(eventName) {
      var v = this._events[eventName];
      if (!v) return [];
      var listeners = new Array(v.length);
      for (var i = 0; i < v.length; i++) {
        listeners[i] = v[i];
      }
      return listeners;
    }
  }]);

  return EventEmitter;
}();

var prototype = EventEmitter.prototype;
var EM = {
  _events: {},
  on: prototype.on,
  once: prototype.once,
  off: prototype.off,
  emit: prototype.emit,
  eventNames: prototype.eventNames,
  listeners: prototype.listeners
};

var enableEvent = function enableEvent(obj) {
  if (obj.emit !== undefined) return false;
  for (var key in EM) {
    obj[key] = EM[key];
  }
  obj._events = {};
  return true;
};

var disableEvent = function disableEvent(obj) {
  if (obj.emit === undefined) return;
  for (var key in EM) {
    delete obj[key];
  }
};

var moduleEvent = function moduleEvent() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';

  var obj = this;
  obj.enableEvent = enableEvent;
  obj.disableEvent = disableEvent;

  return {
    name: name,
    unuse: function unuse() {
      delete obj.enableEvent;
      delete obj.disableEvent;
    }
  };
};

var $ = {
  EventEmitter: EventEmitter,
  enableEvent: enableEvent,
  disableEvent: disableEvent,
  moduleEvent: moduleEvent
};

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {});
  var jm = global.jm;
  if (!jm.EventEmitter) {
    for (var key in $) {
      jm[key] = $[key];
    }
  }
}

exports.default = $;
module.exports = exports['default'];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var preRequest = function preRequest(uri, type, data, opts) {
  // uri为对象时直接返回
  if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
    return uri;
  }

  var r = {
    uri: uri

    // 第2个参数可能为空，data
  };if (type === undefined) {
    return r;
  } else if (type && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    return preRequest(uri, null, type, data);
  } else if (typeof type === 'string') {
    r.type = type;
  }

  // 第3个参数可能为空，data
  if (data === undefined) {
    return r;
  } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    r.data = data;
  }

  // 第4个参数可能为空，附加参数对象
  if (opts === undefined) {
    return r;
  } else if (opts && (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
    r = Object.assign(r, opts);
  }

  return r;
};

var utils = {
  getUriProtocol: function getUriProtocol(uri) {
    if (!uri) return null;
    return uri.substring(0, uri.indexOf(':'));
  },

  getUriPath: function getUriPath(uri) {
    var idx = uri.indexOf('//');
    if (idx === -1) return '';
    idx = uri.indexOf('/', idx + 2);
    if (idx === -1) return '';
    uri = uri.substr(idx);
    idx = uri.indexOf('#');
    if (idx === -1) idx = uri.indexOf('?');
    if (idx !== -1) uri = uri.substr(0, idx);
    return uri;
  },

  enableType: function enableType(obj, types) {
    var self = this;
    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(function (type) {
      obj[type] = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var opts,
            doc,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opts = self.preRequest.apply(this, _args);

                opts.type = type;
                _context.next = 4;
                return obj.request(opts);

              case 4:
                doc = _context.sent;
                return _context.abrupt('return', doc);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    });
  },

  preRequest: preRequest

};

exports.default = utils;
module.exports = exports['default'];
},{}]},{},[2])