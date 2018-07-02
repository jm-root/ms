'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _mdl = require('./mdl');

var _mdl2 = _interopRequireDefault(_mdl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = (0, _mdl2.default)(_client2.default);
$.client = _client2.default;
exports.default = $;
module.exports = exports['default'];