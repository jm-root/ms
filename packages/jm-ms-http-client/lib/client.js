'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flyio = require('flyio');

var _flyio2 = _interopRequireDefault(_flyio);

var _fnclient = require('./fnclient');

var _fnclient2 = _interopRequireDefault(_fnclient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = (0, _fnclient2.default)(_flyio2.default);

exports.default = client;
module.exports = exports['default'];