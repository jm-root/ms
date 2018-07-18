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
 * Class representing a matcher.
 */
var Matcher = function () {
  /**
   * create a matcher.
   * @param {Object} opts
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  sensitive: 是否大小写敏感, 默认false(可选)
   *  strict: 是否检查末尾的分隔符, 默认false(可选)
   *  end: When false the path will match at the beginning. (default: true)
   * }
   */
  function Matcher() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Matcher);

    var uri = opts.uri || '/';
    var type = opts.type;
    type && (type = type.toLowerCase());
    this.type = type;
    this.keys = [];

    this.regexp = (0, _pathToRegexp2.default)(uri, this.keys, opts);

    if (uri === '/' && opts.end === false) {
      this.fast_slash = true;
    }

    if (type === undefined) {
      this.allType = true;
    }
  }

  /**
   * Check if this matcher matches `uri`, if so
   * populate `.params and .uri`.
   *
   * @param {String} uri
   * @return {Object}
   * @api private
   */


  _createClass(Matcher, [{
    key: 'match',
    value: function match() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var params = void 0;
      var uri = opts.uri;

      var type = opts.type;
      type && (type = type.toLowerCase());

      if (type !== this.type && !this.allType) return false;
      if (uri === null || uri === undefined) return false;

      if (this.fast_slash) {
        // fast uri non-ending match for / (everything matches)
        params = {};
        uri = '';
        return {
          params: params,
          uri: uri
        };
      }

      var m = this.regexp.exec(uri);

      if (!m) return false;

      // store values
      params = {};
      uri = m[0];
      var keys = this.keys;
      for (var i = 1; i < m.length; i++) {
        var key = keys[i - 1];
        var prop = key.name;
        params[prop] = m[i];
      }

      return {
        params: params,
        uri: uri
      };
    }
  }]);

  return Matcher;
}();

exports.default = Matcher;
module.exports = exports['default'];