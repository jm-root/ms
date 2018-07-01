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
            logger.info('%s', utils.formatJSON(doc));
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

    var add = function(opts){
        return new Promise(function(resolve, reject){
            logger.info('add %s', utils.formatJSON(opts));
            app.add(opts, function(err, doc){
                log(err, doc);
                resolve(doc);
            });
        });
    };

    var request = function(opts){
        return new Promise(function(resolve, reject){
            logger.info('request %s', utils.formatJSON(opts));
            app.request(opts, function(err, doc){
                log(err, doc);
                resolve(doc);
            });
        });
    };

    var testws = function(opts){
        return new Promise(function(resolve, reject){
            logger.info('test ws');

            if(ms.server){
                //独立的websocket服务
                ms.server(
                    app,
                    {
                        type: 'ws',
                        port: 3100
                    }
                );

                //跟http和express一起使用
                var appWeb = require('express')();
                var server = require('http').createServer(appWeb);

                ms.server(
                    app,
                    {
                        type: 'ws',
                        server: server
                    }
                );
                appWeb.use(function (req, res) {
                    res.send({ msg: "hello, this is jm-ms-ws-client." });
                });

                server.listen(3200, function () { console.log('Listening on ' + server.address().port) });
            }

            ms.client({
                uri: 'ws://localhost:3200',
                reconnect: true
            }, function(err, doc){
                var client = doc;
                client.on('open', function(event) {
                    client.post('/users/123', {data:1}, function(err, doc){
                        log(err, doc);
                    });

                    client.request(opts.request, function(err, doc){
                        log(err, doc);

                        //性能测试
                        // jm.getLogger('jm-ms-ws-client:server').setLevel('INFO');
                        // jm.getLogger('jm-ms-ws-client:client').setLevel('INFO');
                        // logger.setLevel('INFO');
                        logger.info('开始性能测试');
                        var count = 0;
                        var data = [];
                        for(var i=0; i<count; i++) data.push(i);
                        var t = Date.now();
                        var request = function(){
                            return new Promise(function(resolve, reject){
                                client.request(opts.request, function(err, doc){
                                    if (err) {
                                        reject(err, doc);
                                    } else {
                                        resolve(doc);
                                    }
                                });
                            });
                        };
                        Promise.each(data, request).then(function(){
                            logger.info('请求 %j 次, 耗时 %j 毫秒', count, Date.now() - t);
                        });

                    });
                });

                client.on('close', function(){
                    logger.info('断开连接');
                });
            });
            resolve(null);
        });
    };


    var opts = {
        uri: '/users/:id',
        type: 'post',
        fn: function(opts, cb){
            logger.info('func called. %s', utils.formatJSON(opts));
            cb(null, opts.data);
        },
        request: {
            uri: '/users/123',
            type: 'post',
            data: {
                test: true
            },
            ips: ['128.0.0.1', '129.0.0.1']
        }
    };


    add(opts)
        .then(function(doc){
            return request(opts.request);
        })
        .then(function(doc){
            return testws(opts);
        })
        .catch(SyntaxError, function(e) {
            logger.error(e.stack);
        })
        .catch(function(e) {
            logger.error(e.stack);
        });

})();