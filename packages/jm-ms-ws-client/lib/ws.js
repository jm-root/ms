'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Err = _jmErr2.default.Err;
var errNetwork = _jmErr2.default.err(Err.FA_NETWORK);

var Adapter = function () {
  function Adapter(uri) {
    _classCallCheck(this, Adapter);

    var self = this;
    _jmEvent2.default.enableEvent(this);
    var ws = new _ws2.default(uri);
    this.ws = ws;
    ws.on('message', function (data, flags) {
      // flags.binary will be set if a binary data is received.
      // flags.masked will be set if the data was masked.
      self.emit('message', data);
    });
    ws.onopen = function () {
      self.emit('open');
    };
    ws.onerror = function (event) {
      self.emit('error', event);
    };
    ws.onclose = function (event) {
      self.emit('close', event);
    };
  }

  _createClass(Adapter, [{
    key: 'send',
    value: function send() {
      if (!this.ws) throw errNetwork;
      this.ws.send.apply(this.ws, arguments);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.ws) throw errNetwork;
      this.ws.close.apply(this.ws, arguments);
    }
  }]);

  return Adapter;
}();

exports.default = Adapter;
module.exports = exports['default'];