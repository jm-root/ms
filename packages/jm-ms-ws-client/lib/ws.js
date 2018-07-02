'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (uri, onmessage) {
  var ws = new _ws2.default(uri);
  ws.on('message', function (data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    onmessage(data);
  });
  return ws;
};

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];