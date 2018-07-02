"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (uri, onmessage) {
  var ws = new WebSocket(uri);
  ws.onmessage = function (event) {
    onmessage(event.data);
  };
  return ws;
};

;
module.exports = exports["default"];