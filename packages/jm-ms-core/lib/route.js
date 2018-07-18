'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jmRoute = require('jm-route');

var _jmRoute2 = _interopRequireDefault(_jmRoute);

var _matcher = require('./matcher');

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultRoute = function (_Route) {
  _inherits(DefaultRoute, _Route);

  /**
   * create a route.
   * @param {Object} opts params
   * @example
   * opts:{
   *  uri: 接口路径(必填)
   *  type: 请求类型(可选)
   *  fn: 接口处理函数(必填)
   *
   * }
   */
  function DefaultRoute() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DefaultRoute);

    var _this = _possibleConstructorReturn(this, (DefaultRoute.__proto__ || Object.getPrototypeOf(DefaultRoute)).call(this, opts.fn));

    _this.matcher = new _matcher2.default(opts);
    opts.router && (_this.router = opts.router);
    return _this;
  }

  _createClass(DefaultRoute, [{
    key: 'match',
    value: function match(opts) {
      return this.matcher.match(opts);
    }
  }]);

  return DefaultRoute;
}(_jmRoute2.default);

exports.default = DefaultRoute;
module.exports = exports['default'];