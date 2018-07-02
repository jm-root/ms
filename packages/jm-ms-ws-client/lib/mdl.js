'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (client) {
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

  return $;
};

module.exports = exports['default'];