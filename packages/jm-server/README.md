# jm-server

a general server using jm-ms

## using

npm install -g jm-server

jm-server -h
or
jms -h

## config

debug  [false] 是否debug模式

port   [21000] 监听端口

host   ['0.0.0.0'] 监听IP地址

prefix [''] Uri前缀

trust_proxy [false] 是否传递IP地址

lng [''] 语言

maxcpus 只支持环境变量设置, 限制cluster运行模式时能够使用的最多cpu数量, 默认使用全部

max_body_size ['100kb'] 设置允许请求的body的大小, 例如 '5mb'

no_auto_init [false] 一般用不到此选项，是否禁止自动初始化，

no_auto_open [false] 一般用不到此选项，是否禁止自动开放服务器端口，即开始listen

## config/index.js

```javascript
var config = {
    development: {
        //....
        modules: {   //模块
            '': //key， 模块唯一标识
            {
                module: 'jm-ms-message', 模块名或者模块路径， 必须要能够require到
                prefix: uri prefix 默认为key
                config: {}  //可选, 模块配置, 默认采用全局配置
            },
            oms: {
                proxy: 'http://localhost:20170/oms' //proxy指令, 把对于模块的请求转发到指定URI
            },
            pay: {
                httpProxy: 'http://localhost:20170', //httpProxy指令, 透传，直接转发
                prefix: '/pay'
            },
            config: {
                module: 'jm-config'
            }
        }
    },
    production: {
        port: 21000
    }
};
```
