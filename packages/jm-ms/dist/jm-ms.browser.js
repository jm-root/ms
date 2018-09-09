(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jm-ms-core'), require('jm-ms-http-client/dist/browser'), require('jm-ms-ws-client/dist/browser')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jm-ms-core', 'jm-ms-http-client/dist/browser', 'jm-ms-ws-client/dist/browser'], factory) :
  (factory((global['jm-ms'] = {}),global.jmMsCore,global.browser,global.browser$1));
}(this, (function (exports,jmMsCore,browser,browser$1) { 'use strict';

  jmMsCore = jmMsCore && jmMsCore.hasOwnProperty('default') ? jmMsCore['default'] : jmMsCore;
  browser = browser && browser.hasOwnProperty('default') ? browser['default'] : browser;
  browser$1 = browser$1 && browser$1.hasOwnProperty('default') ? browser$1['default'] : browser$1;

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

  var $ =
  /*#__PURE__*/
  function (_MS) {
    _inherits($, _MS);

    function $(opts) {
      var _this;

      _classCallCheck(this, $);

      _this = _possibleConstructorReturn(this, _getPrototypeOf($).call(this, opts));

      _this.use(browser).use(browser$1);

      return _this;
    }

    return $;
  }(jmMsCore);

  var browser$2 = $;

  exports.default = browser$2;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jm-ms.browser.js.map
