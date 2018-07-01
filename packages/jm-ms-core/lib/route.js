'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing a route.
 */
var Route = function () {
  /**
     * create a route.
     * @param {Object} opts params
     * @example
     * opts:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts, cb, next){}(必填)
     *
     * }
     */
  function Route() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Route);

    this.uri = opts.uri || '/';
    this.type = opts.type;
    this._fns = [];
    this.keys = [];
    opts.router && (this.router = opts.router);

    this.regexp = (0, _pathToRegexp2.default)(this.uri, this.keys, opts);

    if (this.uri === '/' && opts.end === false) {
      this.regexp.fast_slash = true;
    }

    if (this.type === undefined) {
      this.allType = true;
    }

    var fns = opts.fn;
    if (!Array.isArray(fns)) {
      fns = [fns];
    }

    for (var i = 0; i < fns.length; i++) {
      var fn = fns[i];
      if (typeof fn !== 'function') {
        var type = toString.call(fn);
        var msg = 'requires callback functions but got a ' + type;
        throw new TypeError(msg);
      }

      this._fns.push(fn);
    }
  }

  _createClass(Route, [{
    key: 'handle',
    value: function handle(opts, cb, next) {
      var idx = 0;
      var fns = this.fns;
      if (fns.length === 0) {
        return next();
      }
      _next();
      function _next(err, doc) {
        if (err) {
          if (err === 'route') {
            return next();
          } else {
            return cb(err, doc);
          }
        }
        var fn = fns[idx++];
        if (!fn) {
          return next(err);
        }
        try {
          fn(opts, cb, _next);
        } catch (err) {
          _next(err);
        }
      }
    }

    /**
       * Check if this route matches `uri`, if so
       * populate `.params`.
       *
       * @param {String} uri
       * @return {Boolean}
       * @api private
       */

  }, {
    key: 'match',
    value: function match(uri, type) {
      this.params = undefined;
      this.uri = undefined;

      type && (type = type.toLowerCase());
      if (type !== this.type && !this.allType) {
        return false;
      }

      if (uri === null || uri === undefined) {
        // no uri, nothing matches
        return false;
      }

      if (this.regexp.fast_slash) {
        // fast uri non-ending match for / (everything matches)
        this.params = {};
        this.uri = '';
        return true;
      }

      var m = this.regexp.exec(uri);

      if (!m) {
        return false;
      }

      // store values
      this.params = {};
      this.uri = m[0];

      var keys = this.keys;
      var params = this.params;

      for (var i = 1; i < m.length; i++) {
        var key = keys[i - 1];
        var prop = key.name;
        params[prop] = m[i];
      }

      return true;
    }
  }, {
    key: 'fns',
    get: function get() {
      return this._fns;
    }
  }]);

  return Route;
}();

exports.default = Route;
module.exports = exports['default'];