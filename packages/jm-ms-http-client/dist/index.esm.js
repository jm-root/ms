import axios from 'axios';
import http from 'http';
import https from 'https';
import jmEvent from 'jm-event';
import jmErr from 'jm-err';
import jmMsCore from 'jm-ms-core';

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

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

var fnclient = function fnclient(_adapter) {
  return function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof opts === 'string') {
      opts = {
        uri: opts
      };
    }

    if (!opts.uri) throw jmErr.err(jmErr.Err.FA_PARAMS);
    var adapter = opts.adapter || _adapter;
    var uri = opts.uri;
    var timeout = opts.timeout || 0;
    var doc = {
      request: function request(opts) {
        try {
          var _this2 = this,
              _arguments2 = arguments;

          opts = utils.preRequest.apply(_this2, _arguments2);
          var headers = opts.headers || {};
          var noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection'];
          noHeaders.forEach(function (key) {
            if (headers[key]) delete headers[key];
          });

          if (opts.ips) {
            headers['x-forwarded-for'] = opts.ips.toString();
          }

          if (opts.lng) {
            headers['lng'] = opts.lng;
          }

          var _opts = {
            method: opts.type || 'get',
            timeout: opts.timeout || timeout,
            headers: headers
          };
          var url = uri + opts.uri;
          return _catch(function () {
            return _await(adapter.request(url, opts.data, _opts), function (doc) {
              var data = doc.data;

              if (data && data.err) {
                var _e = jmErr.err(data);

                throw _e;
              }

              return data;
            });
          }, function (e) {
            var data = null;
            e.response && e.response.data && (data = e.response.data);

            if (data && data.err) {
              var _e2 = jmErr.err(data);

              throw _e2;
            }

            data && (e.data = data);
            throw e;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      },
      notify: function notify(opts) {
        try {
          var _this4 = this,
              _arguments4 = arguments;

          return _awaitIgnored(_this4.request.apply(_this4, _arguments4));
        } catch (e) {
          return Promise.reject(e);
        }
      },
      onReady: function onReady() {
        return true;
      }
    };
    jmEvent.enableEvent(doc);
    return doc;
  };
};

function _empty() {}

var fnclient_1 = fnclient;

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

var mdl = function mdl(adapter) {
  var client = fnclient_1(adapter);

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

  $.client = client;
  return $;
};

var httpAgent = new http.Agent({
  keepAlive: true
});
var httpsAgent = new https.Agent({
  keepAlive: true
}); // axios 比 flyio 快3倍, 所以服务器端选用 axios

var adapter = {
  request: function request(url, data, opts) {
    try {
      var o = Object.assign({
        url: url,
        httpAgent: httpAgent,
        httpsAgent: httpsAgent
      }, opts);

      if (data) {
        var method = o.method;

        if (method === 'post' || method === 'put' || method === 'patch') {
          o.data = data;
        } else {
          o.params = data;
        }
      }

      return axios(o);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
var lib = mdl(adapter);

export default lib;
//# sourceMappingURL=index.esm.js.map
