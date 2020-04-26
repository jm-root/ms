import jmEvent from 'jm-event';
import jmLogger from 'jm-logger';
import jmMsCore from 'jm-ms-core';
import jmErr from 'jm-err';
import jmNet from 'jm-net';

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var utils = jmMsCore.utils;
var WS = jmNet.WebSocket;
var Err = jmErr.Err;
var Timeout = 60000; // 请求超时时间 60 秒

var MAXID = 999999;
var errNetwork = jmErr.err(Err.FA_NETWORK);

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
        _opts$timeout = _opts.timeout,
        timeout = _opts$timeout === void 0 ? Timeout : _opts$timeout,
        _opts$logger = _opts.logger,
        logger = _opts$logger === void 0 ? jmLogger.logger : _opts$logger;
    var _opts2 = opts,
        _opts2$prefix = _opts2.prefix,
        prefix = _opts2$prefix === void 0 ? '' : _opts2$prefix;
    if (!uri) throw jmErr.err(jmErr.Err.FA_PARAMS);
    var path = utils.getUriPath(uri);
    prefix = path + prefix;
    var id = 0;
    var cbs = {};
    var ws = new WS(Object.assign({
      Adapter: _Adapter
    }, opts));
    ws.connect(uri);
    var doc = {
      uri: uri,
      prefix: prefix,
      onReady: function onReady() {
        return ws.onReady();
      },
      request: function request(opts) {
        try {
          var _this2 = this,
              _arguments2 = arguments;

          return _await(_this2.onReady(), function () {
            opts = utils.preRequest.apply(_this2, _arguments2);
            opts.uri = _this2.prefix + (opts.uri || '');
            if (id >= MAXID) id = 0;
            id++;
            opts.id = id;

            _this2.send(JSON.stringify(opts));

            return new Promise(function (resolve, reject) {
              cbs[id] = {
                resolve: resolve,
                reject: reject
              };
              var t = opts.timeout || timeout;
              setTimeout(function () {
                if (cbs[id]) {
                  delete cbs[id];

                  var _e = jmErr.err(Err.FA_TIMEOUT);

                  reject(_e);
                }
              }, t);
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      notify: function notify(opts) {
        try {
          var _this4 = this,
              _arguments4 = arguments;

          return _await(_this4.onReady(), function () {
            opts = utils.preRequest.apply(_this4, _arguments4);
            if (!_this4.connected) throw errNetwork;
            opts.uri = _this4.prefix + (opts.uri || '');

            _this4.send(JSON.stringify(opts));
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      send: function send() {
        ws.send.apply(ws, arguments);
      },
      close: function close() {
        ws.close();
      }
    };
    jmEvent.enableEvent(doc);

    var onmessage = function onmessage(message) {
      doc.emit('message', message);
      var json = null;

      try {
        json = JSON.parse(message);
      } catch (err) {
        return;
      }

      if (json.id) {
        if (cbs[json.id]) {
          var p = cbs[json.id];
          var err = null;
          var _doc = json.data;

          if (_doc.err) {
            err = jmErr.err(_doc);
            p.reject(err);
          } else {
            p.resolve(_doc);
          }

          delete cbs[json.id];
        }
      }
    };

    ws.on('message', function (message) {
      onmessage(message);
    }).on('open', function () {
      id = 0;
      cbs = {};
      doc.emit('open');
      logger.info('ws.opened', uri);
    }).on('error', function (e) {
      doc.emit('error', e);
      logger.error('ws.error', uri);
      logger.error(e);
    }).on('close', function (event) {
      doc.emit('close', event);
      logger.info('ws.closed', uri);
    }).on('heartBeat', function () {
      if (doc.emit('heartBeat')) return true;
      doc.request('/', 'get')["catch"](function (e) {});
      return true;
    }).on('heartDead', function () {
      logger.info('ws.heartDead', uri);
      return doc.emit('heartDead');
    }).on('connect', function () {
      doc.emit('connect');
      logger.info('ws.connect', uri);
    }).on('reconnect', function () {
      doc.emit('reconnect');
      logger.info('ws.reconnect', uri);
    }).on('connectFail', function () {
      doc.emit('connectFail');
      logger.info('ws.connectFail', uri);
    });
    return doc;
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

export default mdl;
//# sourceMappingURL=module.esm.js.map
