'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Adapter) {
  var client = (0, _fnclient2.default)(Adapter);
  var $ = function $() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-ws-client';

    var app = this;
    app.clientModules.ws = client;

    return {
      name: name,
      unuse: function unuse() {
        delete app.clientModules.ws;
      }
    };
  };

  if (typeof global !== 'undefined' && global) {
    global.jm || (global.jm = {});
    var jm = global.jm;
    if (jm.ms) {
      jm.ms.root.use($);
    }
  }

  $.client = client;
  return $;
};

var _fnclient = require('./fnclient');

var _fnclient2 = _interopRequireDefault(_fnclient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];