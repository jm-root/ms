(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jm-ms-core'), require('jm-ms-http-client'), require('jm-ms-ws-client'), require('jm-ms-http-server'), require('jm-ms-ws-server')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jm-ms-core', 'jm-ms-http-client', 'jm-ms-ws-client', 'jm-ms-http-server', 'jm-ms-ws-server'], factory) :
  (global = global || self, factory(global['jm-ms'] = {}, global.jmMsCore, global.jmMsHttpClient, global.jmMsWsClient, global.jmMsHttpServer, global.jmMsWsServer));
}(this, (function (exports, jmMsCore, jmMsHttpClient, jmMsWsClient, jmMsHttpServer, jmMsWsServer) { 'use strict';

  jmMsCore = jmMsCore && jmMsCore.hasOwnProperty('default') ? jmMsCore['default'] : jmMsCore;
  jmMsHttpClient = jmMsHttpClient && jmMsHttpClient.hasOwnProperty('default') ? jmMsHttpClient['default'] : jmMsHttpClient;
  jmMsWsClient = jmMsWsClient && jmMsWsClient.hasOwnProperty('default') ? jmMsWsClient['default'] : jmMsWsClient;
  jmMsHttpServer = jmMsHttpServer && jmMsHttpServer.hasOwnProperty('default') ? jmMsHttpServer['default'] : jmMsHttpServer;
  jmMsWsServer = jmMsWsServer && jmMsWsServer.hasOwnProperty('default') ? jmMsWsServer['default'] : jmMsWsServer;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var $ = /*#__PURE__*/function (_MS) {
    _inherits($, _MS);

    function $() {
      var _this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, $);

      _this = _possibleConstructorReturn(this, _getPrototypeOf($).call(this, opts));

      if (!opts.disable_client) {
        _this.use(jmMsHttpClient).use(jmMsWsClient);
      }

      if (!opts.disable_server && (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object') {
        _this.use(jmMsHttpServer).use(jmMsWsServer);
      }

      return _this;
    }

    return $;
  }(jmMsCore);

  var lib = $;

  exports.default = lib;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jm-ms.js.map
