require('jm-ms-core');
var log = require('jm-logger');
var client = require('../lib').client;

var ms = jm.ms;
var logger = log.logger;
var utils = jm.utils;
var app = ms();

var log = function (err, doc) {
  if (err) {
    logger.error(err.stack);
  }
  if (doc) {
    logger.debug('%s', utils.formatJSON(doc));
  }
};

var done = function (resolve, reject, err, doc) {
  log(err, doc);
  if (err) {
    reject(err, doc);
  } else {
    resolve(doc);
  }
};

client = client({
  uri: 'ws://localhost:3100',
  reconnect: true,
  reconnectAttempts: 3,
  reconnectionDelay: 1000
}, function (err, doc) {
  log(err, doc);
  var ws = doc;
  ws
    .on('connect', function () {
      let uri = this.uri
      let times = this.reconnectAttempts
      let maxTimes = this.maxReconnectAttempts
      if (!times) {
        console.info('connect to ' + uri)
      } else {
        console.info('reconnect to ' + uri + ' ' + times + '/' + maxTimes)
      }
    }.bind(ws))
    .on('connectFail', function () {
      let uri = this.uri
      let times = this.reconnectAttempts
      let maxTimes = this.maxReconnectAttempts
      if (!times) {
        console.info('failed. connect to ' + uri)
      } else {
        console.info('failed. reconnect to ' + uri + ' ' + times + '/' + maxTimes)
      }
    }.bind(ws))
    .on('reconnect', function () {
      let uri = this.uri
      let times = this.reconnectAttempts
      let maxTimes = this.maxReconnectAttempts
      console.info('reconnect ' + times + '/' + maxTimes)
    }.bind(ws))
    .on('open', function () {
      let uri = this.uri
      let times = this.reconnectAttempts
      let maxTimes = this.maxReconnectAttempts
      if (!times) {
        console.info('connected.');
      } else {
        console.info('reconnected. ' + times);
      }
      client = doc;
      ws.request('/', log);
    }.bind(ws))
    .on('close', function (event) {
      if (client) {
        console.info('disconnected.');
        client = null;
      }
    }.bind(ws))
})
