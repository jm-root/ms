require('jm-ms-core');
var log = require('jm-logger');
var server = require('../lib').server;

var ms = jm.ms;
var logger = log.logger;
var utils = jm.utils;
var app = ms();
app.use(function(opts, cb){
    cb(null, {hello: 'jm-ms-ws-client'});
});

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


//独立的websocket服务
server(
    app,
    {
        port: 3100
    },
    log
);
