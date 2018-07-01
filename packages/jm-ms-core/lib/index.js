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

    _jmErr2.default.enableErr(this);
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
           * 支持多种参数格式, 例如
           * proxy({uri:uri, target:target, changeOrigin:true}, cb)
           * proxy(uri, target, changeOrigin, cb)
           * proxy(uri, target, cb)
           * 可以没有回调函数cb
           * proxy({uri:uri, target:target, changeOrigin:true})
           * proxy(uri, target, changeOrigin)
           * proxy(uri, target)
           * @param {String} uri
           * @param {String} target
           * @param {boolean} changeOrigin 是否改变原始uri
           * @param {function} cb 回调cb(err,doc)
           */
      app.proxy = function (uri, target, changeOrigin, cb) {
        var opts = uri;
        if (typeof uri === 'string') {
          opts = {
            uri: uri,
            target: target
          };
          if (typeof changeOrigin === 'boolean') {
            opts.changeOrigin = changeOrigin;
          } else if (changeOrigin && typeof changeOrigin === 'function') {
            cb = changeOrigin;
          }
        } else {
          cb = target;
        }
        opts || (opts = {});
        cb || (cb = function cb(err, doc) {
          if (err) throw err;
        });
        if (!opts.target) {
          var doc = _jmErr2.default.Err.FA_PARAMS;
          var err = _jmErr2.default.err(doc);
          cb(err, doc);
        }
        this.emit('proxy', opts);
        if (typeof opts.target === 'string') {
          opts.target = { uri: opts.target };
        }
        if (opts.changeOrigin) {
          self.client(opts.target, function (err, client) {
            if (err) return cb(err, client);
            app.use(opts.uri, function (opts, cb) {
              client.request(opts, cb);
            });
            cb(err, client);
          });
        } else {
          self.proxy(opts.target, function (err, doc) {
            if (err) return cb(err, doc);
            app.use(opts.uri, doc);
            cb(err, doc);
          });
        }
      };
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
       * @param {function} cb 回调cb(err,doc)
       * @return {Root} - for chaining
       */

  }, {
    key: 'client',
    value: function client() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var err = null;
      var doc = null;
      var type = 'http';
      opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
      opts.type && (type = opts.type);
      type = type.toLowerCase();
      var fn = this.clientModules[type];
      if (!fn) {
        doc = _err2.default.FA_INVALIDTYPE;
        err = _jmErr2.default.err(doc);
        if (cb) cb(err, doc);
      } else {
        fn(opts, function (err, doc) {
          if (!err) _utils2.default.enableType(doc, ['get', 'post', 'put', 'delete']);
          if (cb) cb(err, doc);
        });
      }
      return this;
    }

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
       * @param {function} cb 回调cb(err,doc)
       * @return {Root} - for chaining
       */

  }, {
    key: 'server',
    value: function server() {
      var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var err = null;
      var doc = null;
      var type = 'http';
      opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
      opts.type && (type = opts.type);
      type = type.toLowerCase();
      var fn = this.serverModules[type];
      if (!fn) {
        doc = _err2.default.FA_INVALIDTYPE;
        err = _jmErr2.default.err(doc);
        if (cb) cb(err, doc);
      } else {
        app.emit('server', opts);
        fn(app, opts, cb);
      }
      return this;
    }

    /**
       * 创建一个代理路由
       * 支持多种参数格式, 例如
       * proxy({uri:uri}, cb)
       * proxy(uri, cb)
       * 可以没有回调函数cb
       * proxy({uri:uri})
       * proxy(uri)
       * @param {Object} opts 参数
       * @example
       * opts参数:{
       *  uri: 目标uri(必填)
       * }
       * @param {function} cb 回调cb(err,doc)
       * @return {Router}
       */

  }, {
    key: 'proxy',
    value: function proxy() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var err = null;
      var doc = null;
      if (typeof opts === 'string') {
        opts = { uri: opts };
      }
      if (!opts.uri) {
        doc = _jmErr2.default.Err.FA_PARAMS;
        err = _jmErr2.default.err(doc);
        if (!cb) throw err;
      }
      var app = this.router();
      this.client(opts, function (err, client) {
        if (err) return cb(err, client);
        app.use(function (opts, cb) {
          client.request(opts, cb);
        });
        app.client = client;
        if (cb) cb(null, app);
      });
      return app;
    }
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

    ms.proxy = function (opts, cb) {
      root.proxy(opts, cb);
      return ms;
    };

    ms.client = function (opts, cb) {
      root.client(opts, cb);
      return ms;
    };

    ms.server = function (opts, cb) {
      root.server(opts, cb);
      return ms;
    };
  }
}

exports.default = Root;
module.exports = exports['default'];