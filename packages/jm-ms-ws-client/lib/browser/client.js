'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fnclient = require('../fnclient');

var _fnclient2 = _interopRequireDefault(_fnclient);

var _ws = require('./ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = (0, _fnclient2.default)(_ws2.default);
exports.default = client;
module.exports = exports['default'];