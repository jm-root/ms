if (typeof module !== 'undefined' && module.exports) {
    require('jm-ms-core');
    require('../lib');
    Promise = require('bluebird');
}

(function () {
    var ms = jm.ms;
    var logger = console;
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

    var client = null;
    ms.client({
        uri: 'ws://localhost:3200',
        reconnect: true
    }, function (err, doc) {
        var ws = doc;
        ws.on('open', function (event) {
            console.info('connected.');
            client = doc;
        });
        ws.on('close', function (event) {
            if(client) {
                console.info('disconnected.');
                client = null;
            }
        });
    });


})();