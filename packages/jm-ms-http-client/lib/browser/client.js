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