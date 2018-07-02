'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fly = require('flyio/dist/npm/fly');

var _fly2 = _interopRequireDefault(_fly);

var _mdl = require('../mdl');

var _mdl2 = _interopRequireDefault(_mdl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fly = new _fly2.default();
var $ = (0, _mdl2.default)(fly);
exports.default = $;
module.exports = exports['default'];