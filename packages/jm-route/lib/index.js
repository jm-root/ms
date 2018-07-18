'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class representing a route.
 */
var Route = function () {
  function Route(fns) {
    (0, _classCallCheck3.default)(this, Route);

    this.init.apply(this, arguments);
  }

  (0, _createClass3.default)(Route, [{
    key: 'init',
    value: function init(fns) {
      this.fn = _compose2.default.apply(this, arguments);
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(opts) {
        var doc;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fn(opts);

              case 2:
                doc = _context.sent;

                if (!(doc !== undefined)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', doc);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute(_x) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return Route;
}();

exports.default = Route;
module.exports = exports['default'];