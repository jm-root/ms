'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function $() {
  var fns = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    var o = arguments[i];
    if (Array.isArray(o)) {
      fns.push.apply(fns, (0, _toConsumableArray3.default)(o));
    } else {
      fns.push(o);
    }
  }
  return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _i, _len, fn, doc;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _i = 0, _len = fns.length;

          case 1:
            if (!(_i < _len)) {
              _context.next = 13;
              break;
            }

            fn = fns[_i];
            doc = fn(opts);

            if (!isPromise(doc)) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return doc;

          case 7:
            doc = _context.sent;

          case 8:
            if (!(doc !== undefined)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt('return', doc);

          case 10:
            _i++;
            _context.next = 1;
            break;

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

exports.default = $;
module.exports = exports['default'];