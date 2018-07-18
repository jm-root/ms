'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _jmModule = require('jm-module');

var _jmModule2 = _interopRequireDefault(_jmModule);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _err = require('./err');

var _err2 = _interopRequireDefault(_err);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing a root.
 */
var Root = function () {
  /**
   * create a root
   */
  function Root() {
    _classCallCheck(this, Root);

    _jmModule2.default.enableModule(this);
    this.utils = _utils2.default;
    this.clientModules = {};
    this.serverModules = {};
  }

  /**
   * create a router
   * @param {Object} opts
   * @return {Router}
   */


  _createClass(Root, [{
    key: 'router',
    value: function router() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var self = this;
      var app = new _router2.default(opts);

      /**
       * 添加代理
       * proxy({uri:uri, target:target, changeOrigin:true})
       * proxy(uri, target, changeOrigin)
       * proxy(uri, target)
       * @param {String} uri
       * @param {String} target
       * @param {boolean} changeOrigin 是否改变原始uri
       */
      app.proxy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var target = arguments[1];
        var changeOrigin = arguments[2];
        var doc, err, client;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (typeof uri === 'string') {
                  opts = {
                    uri: uri,
                    target: target,
                    changeOrigin: changeOrigin
                  };
                }

                if (opts.target) {
                  _context.next = 5;
                  break;
                }

                doc = _jmErr2.default.Err.FA_PARAMS;
                err = _jmErr2.default.err(doc);
                throw err;

              case 5:
                this.emit('proxy', opts);
                if (typeof opts.target === 'string') {
                  opts.target = { uri: opts.target };
                }
                _context.next = 9;
                return self.client(opts.target);

              case 9:
                client = _context.sent;


                if (opts.changeOrigin) {
                  app.use(opts.uri, client.request.bind(client));
                } else {
                  app.use(opts.uri, client);
                }

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
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
    key: 'client',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var err, doc, type, fn;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                err = null;
                doc = null;
                type = 'http';

                opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
                opts.type && (type = opts.type);
                type = type.toLowerCase();
                fn = this.clientModules[type];

                if (fn) {
                  _context2.next = 11;
                  break;
                }

                doc = _err2.default.FA_INVALID_TYPE;
                err = _jmErr2.default.err(doc);
                throw err;

              case 11:
                _context2.next = 13;
                return fn(opts);

              case 13:
                doc = _context2.sent;

                if (doc) _utils2.default.enableType(doc, ['get', 'post', 'put', 'delete']);
                return _context2.abrupt('return', doc);

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function client() {
        return _ref2.apply(this, arguments);
      }

      return client;
    }()

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
    key: 'server',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var err, doc, type, fn;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                err = null;
                doc = null;
                type = 'http';

                opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
                opts.type && (type = opts.type);
                type = type.toLowerCase();
                fn = this.serverModules[type];

                if (fn) {
                  _context3.next = 11;
                  break;
                }

                doc = _err2.default.FA_INVALID_TYPE;
                err = _jmErr2.default.err(doc);
                throw err;

              case 11:
                app.emit('server', opts);
                _context3.next = 14;
                return fn(app, opts);

              case 14:
                doc = _context3.sent;
                return _context3.abrupt('return', doc);

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function server() {
        return _ref3.apply(this, arguments);
      }

      return server;
    }()

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
    key: 'proxy',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var err, doc, app, client;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                err = null;
                doc = null;

                if (typeof opts === 'string') {
                  opts = { uri: opts };
                }

                if (opts.uri) {
                  _context4.next = 7;
                  break;
                }

                doc = _jmErr2.default.Err.FA_PARAMS;
                err = _jmErr2.default.err(doc);
                throw err;

              case 7:
                app = this.router();
                _context4.next = 10;
                return this.client(opts);

              case 10:
                client = _context4.sent;

                app.use(client.request.bind(client));
                app.client = client;
                return _context4.abrupt('return', app);

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function proxy() {
        return _ref4.apply(this, arguments);
      }

      return proxy;
    }()
  }]);

  return Root;
}();

if (typeof global !== 'undefined' && global) {
  global.jm || (global.jm = {});
  var jm = global.jm;
  if (!jm.ms) {
    var root = new Root();
    jm.ms = function (opts) {
      return root.router(opts);
    };
    var ms = jm.ms;
    _jmEvent2.default.enableEvent(ms);
    ms.root = root;
    ms.proxy = root.proxy.bind(root);
    ms.client = root.client.bind(root);
    ms.server = root.server.bind(root);
  }
}

exports.default = Root;
module.exports = exports['default'];