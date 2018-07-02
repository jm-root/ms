'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (client) {
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

  return $;
};

module.exports = exports['default'];