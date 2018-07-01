'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
        var fns, i, len, fn, doc;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fns = this.fns;
                i = 0, len = fns.length;

              case 2:
                if (!(i < len)) {
                  _context.next = 12;
                  break;
                }

                fn = fns[i];
                _context.next = 6;
                return fn(opts);

              case 6:
                doc = _context.sent;

                if (!(doc !== undefined)) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', doc);

              case 9:
                i++;
                _context.next = 2;
                break;

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handle(_x2) {
        return _ref.apply(this, arguments);
      }

      return handle;
    }()

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