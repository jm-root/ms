if (typeof module !== 'undefined' && module.exports) {
    require('jm-ms-core');
    require('../lib');
    Promise = require('bluebird');
}

(function(){
    var ms = jm.ms;
    var logger = console;
    var utils = jm.utils;
    var app = ms();

    var log = function(err, doc){
        if (err) {
            logger.error(err.stack);
        }
        if(doc){
            logger.debug('%s', utils.formatJSON(doc));
        }
    };

    var done = function(resolve, reject, err, doc){
        log(err, doc);
        if (err) {
            reject(err, doc);
        } else {
            resolve(doc);
        }
    };

    if(ms.server){
        //独立的websocket服务
        ms.server(
            app,
            {
                type: 'ws',
                port: 3100
            },
            log
        );


        //跟http和express一起使用
        var server = require('http').createServer()
            , appWeb = require('express')()
            ;

        ms.server(
            app,
            {
                type: 'ws',
                server: server
            },
            log
        );
        appWeb.use(function (req, res) {
            res.send({ msg: "hello" });
        });

        server.on('request', appWeb);
        server.listen(3200, function () { console.log('Listening on ' + server.address().port) });

    }


})();