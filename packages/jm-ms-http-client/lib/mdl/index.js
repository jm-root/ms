'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (adapter) {
  var client = (0, _fnclient2.default)(adapter);
  var $ = function $() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-http-client';

    var app = this;
    app.clientModules.http = client;
    app.clientModules.https = client;

    return {
      name: name,
      unuse: function unuse() {
        delete app.clientModules.http;
        delete app.clientModules.https;
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