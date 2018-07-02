'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jmEvent = require('jm-event');

var _jmEvent2 = _interopRequireDefault(_jmEvent);

var _utils = require('jm-ms-core/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultPort = 3000;
var defaultUri = 'http://localhost:' + defaultPort;

var fnclient = function fnclient(_adapter) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var adapter, uri, timeout, doc;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            adapter = opts.adapter || _adapter;
            uri = opts.uri || defaultUri;
            timeout = opts.timeout || 0;
            doc = {
              request: function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
                  var headers,
                      noHeaders,
                      _opts,
                      url,
                      _doc,
                      _args = arguments;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          opts = _utils2.default.preRequest.apply(this, _args);
                          headers = opts.headers || {};
                          noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection'];

                          noHeaders.forEach(function (key) {
                            if (headers[key]) delete headers[key];
                          });
                          if (opts.ips) {
                            headers['x-forwarded-for'] = opts.ips.toString();
                          }
                          if (opts.lng) {
                            headers['lng'] = opts.lng;
                          }

                          _opts = {
                            method: opts.type || 'get',
                            timeout: opts.timeout || timeout,
                            headers: headers
                          };
                          url = uri + opts.uri;
                          _context.prev = 8;
                          _context.next = 11;
                          return adapter.request(url, opts.data, _opts);

                        case 11:
                          _doc = _context.sent;
                          return _context.abrupt('return', _doc.data);

                        case 15:
                          _context.prev = 15;
                          _context.t0 = _context['catch'](8);

                          _context.t0.response && _context.t0.response.data && (_context.t0.data = _context.t0.response.data);
                          throw _context.t0;

                        case 19:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this, [[8, 15]]);
                }));

                function request(_x2) {
                  return _ref2.apply(this, arguments);
                }

                return request;
              }(),
              onReady: function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          return _context2.abrupt('return', true);

                        case 1:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                function onReady() {
                  return _ref3.apply(this, arguments);
                }

                return onReady;
              }()
            };

            _jmEvent2.default.enableEvent(doc);
            return _context3.abrupt('return', doc);

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
};

exports.default = fnclient;
module.exports = exports['default'];