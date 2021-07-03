'use strict';

var jmEvent = require('jm-event');
var jmErr = require('jm-err');
var jmLogger = require('jm-logger');
var jmMsCore = require('jm-ms-core');
var jmNet = require('jm-net');
var jmMsSession = require('jm-ms-session');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var jmEvent__default = /*#__PURE__*/_interopDefaultLegacy(jmEvent);
var jmErr__default = /*#__PURE__*/_interopDefaultLegacy(jmErr);
var jmLogger__default = /*#__PURE__*/_interopDefaultLegacy(jmLogger);
var jmMsCore__default = /*#__PURE__*/_interopDefaultLegacy(jmMsCore);
var jmNet__default = /*#__PURE__*/_interopDefaultLegacy(jmNet);
var jmMsSession__default = /*#__PURE__*/_interopDefaultLegacy(jmMsSession);

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

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
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

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var EventEmitter = jmEvent__default['default'].EventEmitter;
var Err = jmErr__default['default'].Err;
var errNetwork = jmErr__default['default'].err(Err.FA_NETWORK);

var ws = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Adapter, _EventEmitter);

  var _super = _createSuper(Adapter);

  function Adapter(uri) {
    var _this;

    _classCallCheck(this, Adapter);

    _this = _super.call(this, {
      async: true
    });
    var ws = new WebSocket(uri); // eslint-disable-line

    _this.ws = ws;

    ws.onmessage = function (event) {
      _this.emit('message', event.data);
    };

    ws.onopen = function () {
      _this.emit('open');
    };

    ws.onerror = function (event) {
      _this.emit('error', event);
    };

    ws.onclose = function (event) {
      _this.emit('close', event);
    };

    return _this;
  }

  _createClass(Adapter, [{
    key: "send",
    value: function send() {
      if (!this.ws) throw errNetwork;
      this.ws.send.apply(this.ws, arguments);
    }
  }, {
    key: "close",
    value: function close() {
      if (!this.ws) throw errNetwork;
      this.ws.close.apply(this.ws, arguments);
    }
  }]);

  return Adapter;
}(EventEmitter);

var utils = jmMsCore__default['default'].utils;
var WS = jmNet__default['default'].WebSocket;

var ClientSession = /*#__PURE__*/function (_Session) {
  _inherits(ClientSession, _Session);

  var _super = _createSuper(ClientSession);

  function ClientSession() {
    _classCallCheck(this, ClientSession);

    return _super.apply(this, arguments);
  }

  _createClass(ClientSession, [{
    key: "request",
    value: function request(opts) {
      opts = utils.preRequest.apply(this, arguments);
      opts.uri = this.prefix + (opts.uri || '');
      return _get(_getPrototypeOf(ClientSession.prototype), "request", this).call(this, opts);
    }
  }, {
    key: "notify",
    value: function notify(opts) {
      opts = utils.preRequest.apply(this, arguments);
      opts.uri = this.prefix + (opts.uri || '');
      return _get(_getPrototypeOf(ClientSession.prototype), "notify", this).call(this, opts);
    }
  }, {
    key: "onRequest",
    value: function onRequest(opts) {
      opts.session = this;
      opts.ips && opts.ips.length && (opts.ip = opts.ips[0]);
      opts.protocol = 'ws';
      return _get(_getPrototypeOf(ClientSession.prototype), "onRequest", this).call(this, opts);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var prefix = this.prefix,
          uri = this.uri,
          timeout = this.timeout,
          debug = this.debug;
      return {
        prefix: prefix,
        uri: uri,
        timeout: timeout,
        debug: debug
      };
    }
  }]);

  return ClientSession;
}(jmMsSession__default['default']);

var fnclient = function fnclient(_Adapter) {
  return function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof opts === 'string') {
      opts = {
        uri: opts
      };
    }

    var _opts = opts,
        uri = _opts.uri,
        timeout = _opts.timeout,
        _opts$logger = _opts.logger,
        logger = _opts$logger === void 0 ? jmLogger__default['default'].logger : _opts$logger,
        debug = _opts.debug;
    var _opts2 = opts,
        _opts2$prefix = _opts2.prefix,
        prefix = _opts2$prefix === void 0 ? '' : _opts2$prefix;
    if (!uri) throw jmErr__default['default'].err(jmErr__default['default'].Err.FA_PARAMS);
    var path = utils.getUriPath(uri);
    prefix = path + prefix;
    var ws = new WS(Object.assign({
      Adapter: _Adapter
    }, opts));
    ws.connect(uri);
    var session = new ClientSession({
      debug: debug,
      logger: logger,
      timeout: timeout
    });
    Object.assign(session, {
      uri: uri,
      prefix: prefix,
      send: function send() {
        ws.send.apply(ws, arguments);
      },
      close: function close() {
        ws.close.apply(ws, arguments);
      }
    });
    ws.on('message', function (message) {
      session.emit('message', message);
    }).on('open', function () {
      session.emit('open');
      logger.info('ws.opened', uri);
    }).on('error', function (e) {
      session.emit('error', e);
      logger.error('ws.error', uri);
      logger.error(e);
    }).on('close', function (event) {
      session.reset();
      session.emit('close', event);
      logger.info('ws.closed', uri);
    }).on('heartBeat', function () {
      if (session.emit('heartBeat')) return true;
      session.notify('/', 'get');
      return true;
    }).on('heartDead', function () {
      logger.info('ws.heartDead', uri);
      return session.emit('heartDead');
    }).on('connect', function () {
      session.emit('connect');
      logger.info('ws.connect', uri);
    }).on('reconnect', function () {
      session.emit('reconnect');
      logger.info('ws.reconnect', uri);
    }).on('connectFail', function () {
      session.emit('connectFail');
      logger.info('ws.connectFail', uri);
    });
    return session;
  };
};

var mdl = function mdl(Adapter) {
  var client = fnclient(Adapter);

  var $ = function $() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-ws-client';
    var app = this;
    app.clientModules.ws = client;
    app.clientModules.wss = client;
    return {
      name: name,
      unuse: function unuse() {
        delete app.clientModules.ws;
        delete app.clientModules.wss;
      }
    };
  };

  $.client = client;
  return $;
};

var browser = mdl(ws);

module.exports = browser;
//# sourceMappingURL=browser.js.map
