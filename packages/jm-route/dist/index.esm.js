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

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _async = function () {
  try {
    if (isNaN.apply(null, {})) {
      return function (f) {
        return function () {
          try {
            return Promise.resolve(f.apply(this, arguments));
          } catch (e) {
            return Promise.reject(e);
          }
        };
      };
    }
  } catch (e) {}

  return function (f) {
    // Pre-ES5.1 JavaScript runtimes don't accept array-likes in Function.apply
    return function () {
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
}();

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

function _for(test, update, body) {
  var stage;

  for (;;) {
    var shouldContinue = test();

    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.__value;
    }

    if (!shouldContinue) {
      return result;
    }

    if (shouldContinue.then) {
      stage = 0;
      break;
    }

    var result = body();

    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.__state;
      } else {
        stage = 1;
        break;
      }
    }

    if (update) {
      var updateValue = update();

      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }

  var pact = new _Pact();

  var reject = _settle.bind(null, pact, 2);

  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;

  function _resumeAfterBody(value) {
    result = value;

    do {
      if (update) {
        updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }

      shouldContinue = test();

      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.__value) {
        _settle(pact, 1, result);

        return;
      }

      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }

      result = body();

      if (_isSettledPact(result)) {
        result = result.__value;
      }
    } while (!result || !result.then);

    result.then(_resumeAfterBody).then(void 0, reject);
  }

  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }

  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.__state === 1;
}

var _Pact = function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var state = this.__state;

    if (state) {
      var callback = state == 1 ? onFulfilled : onRejected;

      if (callback) {
        var _result = new _Pact();

        try {
          _settle(_result, 1, callback(this.__value));
        } catch (e) {
          _settle(_result, 2, e);
        }

        return _result;
      } else {
        return this;
      }
    }

    var result = new _Pact();

    this.__observer = function (_this) {
      try {
        var value = _this.__value;

        if (_this.__state == 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _settle(pact, state, value) {
  if (!pact.__state) {
    if (value instanceof _Pact) {
      if (value.__state) {
        if (state === 1) {
          state = value.__state;
        }

        value = value.__value;
      } else {
        value.__observer = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.__state = state;
    pact.__value = value;
    var observer = pact.__observer;

    if (observer) {
      observer(pact);
    }
  }
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  value = Promise.resolve(value);
  return then ? value.then(then) : value;
}

function isPromise(obj) {
  return !!obj && (_typeof(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
/**
 * Class representing a route.
 */


var Route = /*#__PURE__*/function () {
  function Route() {
    _classCallCheck(this, Route);

    this.logging = false;
    this.benchmark = false;
    this.fns = Array.prototype.slice.call(arguments);
  }

  _createClass(Route, [{
    key: "execute",
    value: _async(function () {
      var _this = this,
          _arguments = arguments,
          _interrupt = false;

      var t1 = 0;
      var t2 = 0;
      var doc;
      var fns = _this.fns;

      if (_this.logging) {
        if (_this.benchmark) t1 = Date.now();
        var msg = 'Execute';
        _this.name && (msg += " ".concat(_this.name));
        msg += " args: ".concat(JSON.stringify(_toConsumableArray(_arguments)));
        console.info(msg);
      }

      var i = 0,
          len = fns.length;
      return _continue(_for(function () {
        return !_interrupt && i < len;
      }, function () {
        return i++;
      }, function () {
        var fn = fns[i];
        if (_this.logging && _this.benchmark) t2 = Date.now();
        doc = fn.apply(void 0, _toConsumableArray(_arguments));
        return _invoke(function () {
          if (isPromise(doc)) {
            return _await(doc, function (_doc) {
              doc = _doc;
            });
          }
        }, function () {
          if (_this.logging) {
            var _msg = "Step: ".concat(i, " ").concat(fn.name, " args: ").concat(JSON.stringify(_toConsumableArray(_arguments)));

            if (_this.benchmark) _msg += " Elapsed time: ".concat(Date.now() - t2, "ms");
            console.info(_msg);
          }

          if (doc !== undefined) {
            _interrupt = true;
          }
        });
      }), function () {
        if (_this.logging) {
          var _msg2 = 'Executed';
          _this.name && (_msg2 += " ".concat(_this.name));
          if (doc !== undefined) _msg2 += " result: ".concat(JSON.stringify(doc));
          if (_this.benchmark) _msg2 += " Elapsed time: ".concat(Date.now() - t1, "ms");
          console.info(_msg2);
        }

        if (doc !== undefined) return doc;
      });
    })
  }, {
    key: "fns",
    get: function get() {
      return this._fns;
    },
    set: function set(value) {
      var fns = [];

      for (var _i = 0, _len = value.length; _i < _len; _i++) {
        var o = value[_i];

        if (Array.isArray(o)) {
          fns.push.apply(fns, _toConsumableArray(o));
        } else {
          fns.push(o);
        }
      }

      this._fns = fns;
    }
  }]);

  return Route;
}();

var lib = Route;

export default lib;
//# sourceMappingURL=index.esm.js.map
