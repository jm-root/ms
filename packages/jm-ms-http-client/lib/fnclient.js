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

var fnclient = function fnclient($) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var uri, timeout, doc;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            uri = opts.uri || defaultUri;
            timeout = opts.timeout || 0;
            doc = {
              request: function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
                  var type,
                      headers,
                      noHeaders,
                      _opts,
                      url,
                      doc,
                      _args = arguments;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          opts = _utils2.default.preRequest.apply(this, _args);
                          type = opts.type || 'get';
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
                            timeout: opts.timeout || timeout,
                            headers: headers
                          };
                          url = uri + opts.uri;
                          _context.next = 11;
                          return $[type](url, opts.data, _opts);

                        case 11:
                          doc = _context.sent;
                          return _context.abrupt('return', doc);

                        case 13:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                function request(_x2) {
                  return _ref2.apply(this, arguments);
                }

                return request;
              }()
            };

            _jmEvent2.default.enableEvent(doc);
            setTimeout(function () {
              doc.emit('open');
            }, 1);
            return _context2.abrupt('return', doc);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
};

exports.default = fnclient;
module.exports = exports['default'];