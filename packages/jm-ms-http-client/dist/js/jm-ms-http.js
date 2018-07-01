(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fly = require('flyio/dist/npm/fly');

var _fly2 = _interopRequireDefault(_fly);

var _fnclient = require('../fnclient');

var _fnclient2 = _interopRequireDefault(_fnclient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fly = new _fly2.default();

var client = (0, _fnclient2.default)(fly);

exports.default = client;
module.exports = exports['default'];
},{"../fnclient":3,"flyio/dist/npm/fly":4}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleClient = function moduleClient() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-http-client';

  var app = this;
  app.clientModules.http = _client2.default;
  app.clientModules.https = _client2.default;

  return {
    name: name,
    unuse: function unuse() {
      delete app.clientModules.http;
    }
  };
};

var $ = {
  moduleClient: moduleClient
};

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {});
  var jm = global.jm;
  if (jm.ms) {
    for (var key in $) {
      jm.ms.root.use($[key]);
    }
  }
}

$.client = _client2.default;
exports.default = $;
module.exports = exports['default'];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./client":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _utils = require('jm-ms-core/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultPort = 3000;
var defaultUri = 'http://localhost:' + defaultPort;

var fnclient = function fnclient($) {
  return function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var err = null;
    var doc = null;
    var uri = opts.uri || defaultUri;
    var timeout = opts.timeout || 0;

    doc = {
      request: function request(opts, cb) {
        var r = _utils2.default.preRequest.apply(this, arguments);
        opts = r.opts;
        cb = r.cb;
        var type = opts.type || 'get';
        var headers = opts.headers || {};
        var noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection'];
        noHeaders.forEach(function (key) {
          if (headers[key]) delete headers[key];
        });
        if (opts.ips) {
          headers['x-forwarded-for'] = opts.ips.toString();
        }
        if (opts.lng) {
          headers['lng'] = opts.lng;
        }

        var _opts = {
          timeout: opts.timeout || timeout,
          headers: headers
        };
        var url = uri + opts.uri;
        var p = $[type](url, opts.data, _opts);
        if (!cb) return p;

        p.then(function (doc) {
          cb(null, doc.data);
        }).catch(function (e) {
          cb(e, e.response.data);
        });
      }
    };
    _jmEvent2.default.enableEvent(doc);

    if (cb) cb(err, doc);
    doc.emit('open');
  };
};

exports.default = fnclient;
module.exports = exports['default'];
},{"jm-event":5,"jm-ms-core/lib/utils":6}],4:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
    type: function type(ob) {
        return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
    },
    isObject: function isObject(ob, real) {
        if (real) {
            return this.type(ob) === "object";
        } else {
            return ob && (typeof ob === 'undefined' ? 'undefined' : _typeof(ob)) === 'object';
        }
    },
    isFormData: function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
    },
    trim: function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    encode: function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    },
    formatParams: function formatParams(data) {
        var str = "";
        var first = true;
        var that = this;
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
            return data;
        }
        function _encode(sub, path) {
            var encode = that.encode;
            var type = that.type(sub);
            if (type == "array") {
                sub.forEach(function (e, i) {
                    _encode(e, path + "%5B%5D");
                });
            } else if (type == "object") {
                for (var key in sub) {
                    if (path) {
                        _encode(sub[key], path + "%5B" + encode(key) + "%5D");
                    } else {
                        _encode(sub[key], encode(key));
                    }
                }
            } else {
                if (!first) {
                    str += "&";
                }
                first = false;
                str += path + "=" + encode(sub);
            }
        }

        _encode(data, "");
        return str;
    },

    // Do not overwrite existing attributes
    merge: function merge(a, b) {
        for (var key in b) {
            if (!a.hasOwnProperty(key)) {
                a[key] = b[key];
            } else if (this.isObject(b[key], 1) && this.isObject(a[key], 1)) {
                this.merge(a[key], b[key]);
            }
        }
        return a;
    }
};

/***/ }),
/* 1 */,
    /* 2 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

var Fly = function () {
    function Fly(engine) {
        _classCallCheck(this, Fly);

        this.engine = engine || XMLHttpRequest;

        this.default = this; //For typeScript

        /**
         * Add  lock/unlock API for interceptor.
         *
         * Once an request/response interceptor is locked, the incoming request/response
         * will be added to a queue before they enter the interceptor, they will not be
         * continued  until the interceptor is unlocked.
         *
         * @param [interceptor] either is interceptors.request or interceptors.response
         */
        function wrap(interceptor) {
            var completer;
            utils.merge(interceptor, {
                lock: function lock() {
                    if (!completer) {
                        interceptor.p = new Promise(function (resolve) {
                            completer = resolve;
                        });
                    }
                },
                unlock: function unlock() {
                    if (completer) {
                        completer();
                        interceptor.p = completer = null;
                    }
                }
            });
        }

        var interceptors = this.interceptors = {
            response: {
                use: function use(handler, onerror) {
                    this.handler = handler;
                    this.onerror = onerror;
                }
            },
            request: {
                use: function use(handler) {
                    this.handler = handler;
                }
            }
        };

        var irq = interceptors.request;
        var irp = interceptors.response;
        wrap(irp);
        wrap(irq);

        this.config = {
            method: "GET",
            baseURL: "",
            headers: {},
            timeout: 0,
            parseJson: true, // Convert response data to JSON object automatically.
            withCredentials: false
        };
    }

    _createClass(Fly, [{
        key: "request",
        value: function request(url, data, options) {
            var _this = this;

            var engine = new this.engine();
            var contentType = "Content-Type";
            var contentTypeLowerCase = contentType.toLowerCase();
            var interceptors = this.interceptors;
            var requestInterceptor = interceptors.request;
            var responseInterceptor = interceptors.response;
            var requestInterceptorHandler = requestInterceptor.handler;
            var promise = new Promise(function (resolve, reject) {
                if (utils.isObject(url)) {
                    options = url;
                    url = options.url;
                }
                options = options || {};
                options.headers = options.headers || {};

                function isPromise(p) {
                    // some  polyfill implementation of Promise may be not standard,
                    // so, we test by duck-typing
                    return p && p.then && p.catch;
                }

                /**
                 * If the request/response interceptor has been locked，
                 * the new request/response will enter a queue. otherwise, it will be performed directly.
                 * @param [promise] if the promise exist, means the interceptor is  locked.
                 * @param [callback]
                 */
                function enqueueIfLocked(promise, callback) {
                    if (promise) {
                        promise.then(function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                }

                // make the http request
                function makeRequest(options) {
                    data = options.body;
                    // Normalize the request url
                    url = utils.trim(options.url);
                    var baseUrl = utils.trim(options.baseURL || "");
                    if (!url && isBrowser && !baseUrl) url = location.href;
                    if (url.indexOf("http") !== 0) {
                        var isAbsolute = url[0] === "/";
                        if (!baseUrl && isBrowser) {
                            var arr = location.pathname.split("/");
                            arr.pop();
                            baseUrl = location.protocol + "//" + location.host + (isAbsolute ? "" : arr.join("/"));
                        }
                        if (baseUrl[baseUrl.length - 1] !== "/") {
                            baseUrl += "/";
                        }
                        url = baseUrl + (isAbsolute ? url.substr(1) : url);
                        if (isBrowser) {

                            // Normalize the url which contains the ".." or ".", such as
                            // "http://xx.com/aa/bb/../../xx" to "http://xx.com/xx" .
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }

                    var responseType = utils.trim(options.responseType || "");
                    engine.withCredentials = !!options.withCredentials;
                    var isGet = options.method === "GET";
                    if (isGet) {
                        if (data) {
                            if (utils.type(data) !== "string") {
                                data = utils.formatParams(data);
                            }
                            url += (url.indexOf("?") === -1 ? "?" : "&") + data;
                        }
                    }
                    engine.open(options.method, url);

                    // try catch for ie >=9
                    try {
                        engine.timeout = options.timeout || 0;
                        if (responseType !== "stream") {
                            engine.responseType = responseType;
                        }
                    } catch (e) {
                    }

                    if (!isGet) {
                        // default content type
                        var _contentType = "application/x-www-form-urlencoded";
                        // If the request data is json object, transforming it  to json string,
                        // and set request content-type to "json". In browser,  the data will
                        // be sent as RequestBody instead of FormData
                        if (utils.trim((options.headers[contentType] || "").toLowerCase()) === _contentType) {
                            data = utils.formatParams(data);
                        } else if (!utils.isFormData(data) && ["object", "array"].indexOf(utils.type(data)) !== -1) {
                            _contentType = 'application/json;charset=utf-8';
                            data = JSON.stringify(data);
                        }
                        options.headers[contentType] = _contentType;
                    }

                    for (var k in options.headers) {
                        if (k === contentType && (utils.isFormData(data) || !data || isGet)) {
                            // Delete the content-type, Let the browser set it
                            delete options.headers[k];
                        } else {
                            try {
                                // In browser environment, some header fields are readonly,
                                // write will cause the exception .
                                engine.setRequestHeader(k, options.headers[k]);
                            } catch (e) {
                            }
                        }
                    }

                    function onresult(handler, data, type) {
                        enqueueIfLocked(responseInterceptor.p, function () {
                            if (handler) {
                                //如果失败，添加请求信息
                                if (type) {
                                    data.request = options;
                                }
                                var ret = handler.call(responseInterceptor, data, Promise);
                                data = ret === undefined ? data : ret;
                            }
                            if (!isPromise(data)) {
                                data = Promise[type === 0 ? "resolve" : "reject"](data);
                            }
                            data.then(function (d) {
                                resolve(d);
                            }).catch(function (e) {
                                reject(e);
                            });
                        });
                    }

                    function onerror(e) {
                        e.engine = engine;
                        onresult(responseInterceptor.onerror, e, -1);
                    }

                    function Err(msg, status) {
                        this.message = msg;
                        this.status = status;
                    }

                    engine.onload = function () {
                        // The xhr of IE9 has not response filed
                        var response = engine.response || engine.responseText;
                        if (options.parseJson && (engine.getResponseHeader(contentType) || "").indexOf("json") !== -1
                        // Some third engine implementation may transform the response text to json object automatically,
                        // so we should test the type of response before transforming it
                        && !utils.isObject(response)) {
                            response = JSON.parse(response);
                        }
                        var headers = {};
                        var items = (engine.getAllResponseHeaders() || "").split("\r\n");
                        items.pop();
                        items.forEach(function (e) {
                            var key = e.split(":")[0];
                            headers[key] = engine.getResponseHeader(key);
                        });
                        var status = engine.status;
                        var statusText = engine.statusText;
                        var data = {data: response, headers: headers, status: status, statusText: statusText};
                        // The _response filed of engine is set in  adapter which be called in engine-wrapper.js
                        utils.merge(data, engine._response);
                        if (status >= 200 && status < 300 || status === 304) {
                            data.engine = engine;
                            data.request = options;
                            onresult(responseInterceptor.handler, data, 0);
                        } else {
                            var e = new Err(statusText, status);
                            e.response = data;
                            onerror(e);
                        }
                    };

                    engine.onerror = function (e) {
                        onerror(new Err(e.msg || "Network Error", 0));
                    };

                    engine.ontimeout = function () {
                        onerror(new Err("timeout [ " + engine.timeout + "ms ]", 1));
                    };
                    engine._options = options;
                    setTimeout(function () {
                        engine.send(isGet ? null : data);
                    }, 0);
                }

                enqueueIfLocked(requestInterceptor.p, function () {
                    utils.merge(options, _this.config);
                    var headers = options.headers;
                    headers[contentType] = headers[contentType] || headers[contentTypeLowerCase] || "";
                    delete headers[contentTypeLowerCase];
                    options.body = data || options.body;
                    url = utils.trim(url || "");
                    options.method = options.method.toUpperCase();
                    options.url = url;
                    var ret = options;
                    if (requestInterceptorHandler) {
                        ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options;
                    }
                    if (!isPromise(ret)) {
                        ret = Promise.resolve(ret);
                    }
                    ret.then(function (d) {
                        //if options continue
                        if (d === options) {
                            makeRequest(d);
                        } else {
                            resolve(d);
                        }
                    }, function (err) {
                        reject(err);
                    });
                });
            });
            promise.engine = engine;
            return promise;
        }
    }, {
        key: "all",
        value: function all(promises) {
            return Promise.all(promises);
        }
    }, {
        key: "spread",
        value: function spread(callback) {
            return function (arr) {
                return callback.apply(null, arr);
            };
        }
    }, {
        key: "lock",
        value: function lock() {
            this.interceptors.request.lock();
        }
    }, {
        key: "unlock",
        value: function unlock() {
            this.interceptors.request.unlock();
        }
    }]);

    return Fly;
}();

//For typeScript


        Fly.default = Fly;

["get", "post", "put", "patch", "head", "delete"].forEach(function (e) {
    Fly.prototype[e] = function (url, data, option) {
        return this.request(url, data, utils.merge({ method: e }, option));
    };
});
// Learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = Fly;

/***/ })
/******/ ]);
});
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jmUtils = require('jm-utils');

var _jmUtils2 = _interopRequireDefault(_jmUtils);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = _jmUtils2.default.utils;
utils.enableType = function (obj, types) {
  if (!Array.isArray(types)) {
    types = [types];
  }
  types.forEach(function (type) {
    if (typeof Promise !== 'undefined') {
      obj[type] = function (uri, data, params, timeout, cb) {
        var opts = uri;
        if (typeof uri === 'string') {
          var r = utils.preRequest.apply(this, arguments);
          opts = r.opts;
          cb = r.cb;
        } else {
          cb = data;
        }
        opts.type = type;

        if (cb) {
          this[type](opts).then(function (doc) {
            cb(null, doc);
          }).catch(function (err) {
            cb(err);
          });
          return this;
        }

        return new Promise(function (resolve, reject) {
          obj.request(opts, function (err, doc) {
            if (!err && doc && doc.err) err = _jmErr2.default.err(doc);
            if (err) return reject(err);
            resolve(doc);
          });
        });
      };
    } else {
      obj[type] = function (uri, data, params, timeout, cb) {
        if (typeof uri === 'string') {
          return obj.request(uri, type, data, params, timeout, cb);
        }
        uri.type = type;
        return obj.request(uri, data);
      };
    }
  });
};

utils.preRequest = function (uri, type, data, params, timeout, cb) {
  // uri为对象时直接返回
  if (typeof uri !== 'string') {
    return {
      opts: uri,
      cb: type
    };
  }

  var opts = {
    uri: uri
  };

  var r = {
    opts: opts

    // 第2个参数可能为空，cb，timeout, data
  };if (type === undefined) {
    return r;
  }
  if (typeof type === 'function') {
    r.cb = type;
    return r;
  }
  if (typeof type === 'number') {
    return utils.preRequest(uri, null, null, null, type, data);
  } else if (type && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    return utils.preRequest(uri, null, type, data, params, timeout);
  } else if (typeof type === 'string') {
    opts.type = type;
  }

  // 第3个参数可能为空，cb，timeout, data
  if (data === undefined) {
    return r;
  }
  if (typeof data === 'function') {
    r.cb = data;
    return r;
  }
  if (typeof data === 'number') {
    return utils.preRequest(uri, type, null, null, data, params);
  } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    opts.data = data;
  }

  // 第4个参数可能为空，cb，timeout, params
  if (params === undefined) {
    return r;
  }
  if (typeof params === 'function') {
    r.cb = params;
    return r;
  }
  if (typeof params === 'number') {
    return utils.preRequest(uri, type, data, null, params, timeout);
  } else if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
    opts.params = params;
  }

  // 第5个参数可能为空，cb，timeout
  if (timeout === undefined) {
    return r;
  }
  if (typeof timeout === 'function') {
    r.cb = timeout;
    return r;
  }
  if (typeof timeout === 'number') {
    opts.timeout = timeout;
  }

  // 第6个参数可能为空，cb
  if (cb === undefined) {
    return r;
  }
  if (typeof cb === 'function') {
    r.cb = cb;
    return r;
  }

  return r;
};

exports.default = utils;
module.exports = exports['default'];
},{"jm-err":7,"jm-utils":10}],7:[function(require,module,exports){
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
},{"./locale":8}],8:[function(require,module,exports){
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
},{"./zh_CN":9}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var argsClass = '[object Arguments]';
var arrayClass = '[object Array]';
var boolClass = '[object Boolean]';
var dateClass = '[object Date]';
var funcClass = '[object Function]';
var numberClass = '[object Number]';
var objectClass = '[object Object]';
var regexpClass = '[object RegExp]';
var stringClass = '[object String]';

/** Used to identify object classifications that `cloneDeep` supports */
var cloneableClasses = {};
cloneableClasses[funcClass] = false;
cloneableClasses[argsClass] = true;
cloneableClasses[arrayClass] = true;
cloneableClasses[boolClass] = true;
cloneableClasses[dateClass] = true;
cloneableClasses[numberClass] = true;
cloneableClasses[objectClass] = true;
cloneableClasses[regexpClass] = true;
cloneableClasses[stringClass] = true;

var ctorByClass = {};
ctorByClass[arrayClass] = Array;
ctorByClass[boolClass] = Boolean;
ctorByClass[dateClass] = Date;
ctorByClass[objectClass] = Object;
ctorByClass[numberClass] = Number;
ctorByClass[regexpClass] = RegExp;
ctorByClass[stringClass] = String;

/** Used to match regexp flags from their coerced string values */
var reFlags = /\w*$/;

var cloneDeep = function cloneDeep(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || !obj) return obj;
  if (Array.isArray(obj)) {
    var _ret = [];
    obj.forEach(function (item) {
      _ret.push(cloneDeep(item));
    });
    return _ret;
  }
  var className = toString.call(obj);
  if (!cloneableClasses[className]) {
    return obj;
  }
  var ctor = ctorByClass[className];
  switch (className) {
    case boolClass:
    case dateClass:
      return new ctor(+obj);

    case numberClass:
    case stringClass:
      return new ctor(obj);

    case regexpClass:
      return ctor(obj.source, reFlags.exec(obj));
  }

  var ret = {};
  var keys = Object.keys(obj);
  keys.forEach(function (key) {
    ret[key] = cloneDeep(obj[key]);
  });
  return ret;
};

var merge = function merge(obj1, obj2) {
  if ((typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) !== 'object' || !obj1) return obj1;
  if (Array.isArray(obj1)) {
    obj2.forEach(function (item) {
      if (obj1.indexOf(item) === -1) {
        obj1.push(item);
      }
    });
    return obj1;
  }
  var keys = Object.keys(obj2);
  keys.forEach(function (key) {
    if (obj1[key] && _typeof(obj1[key]) === 'object' && _typeof(obj2[key]) === 'object') {
      merge(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
};

var utils = {
  // 高效slice
  slice: function slice(a, start, end) {
    start = start || 0;
    end = end || a.length;
    if (start < 0) start += a.length;
    if (end < 0) end += a.length;
    var r = new Array(end - start);
    for (var i = start; i < end; i++) {
      r[i - start] = a[i];
    }
    return r;
  },

  formatJSON: function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
  },

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

  cloneDeep: cloneDeep,

  merge: merge
};

var moduleUtils = function moduleUtils() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'utils';

  var app = this;
  app[name] = utils;

  return {
    name: name,
    unuse: function unuse() {
      delete app[name];
    }
  };
};

var $ = {
  utils: utils,
  moduleUtils: moduleUtils
};

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {});
  var jm = global.jm;
  if (!jm.utils) {
    for (var key in $) {
      jm[key] = $[key];
    }
  }
}

exports.default = $;
module.exports = exports['default'];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])