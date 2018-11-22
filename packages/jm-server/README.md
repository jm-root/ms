---
theme : "white"
---

# jm-server

micro server using jm-ms

<small>作者：[鱼哥](https://github.com/jammacn)</small>

---

## why

- 微服务架构把传统的单体应用拆分为多个小应用，每个小应用麻雀虽小，五脏俱全。

- 应用一般会包含配置、通讯、日志和一些公共服务，每个小应用都重复去实现这些部分没有必要，也不利于以后的维护和扩展。

---

## 目标

- 作为一个微服务器框架，帮助开发者把精力集中在服务及路由的开发，而不必关注底层的实现。
- 采用模块化设计，开发者可以把多个微服务集中在一个单体应用中部署，从而兼容传统的软件开发模式。可合可分，非常灵活。

---

## features

- 模块化设计

- 路由式编程模式 基于 jm-ms

- 支持多协议 http、ws

- 支持代理转发 proxy

---

## install

```
npm i -g jm-server
```

---

## use:

```
// 控制台启动
jm-server -h
// or
jms -h

// 代码中启动
require('jm-server/bin/app')
```

---

## 工作原理

- 读取配置文件中的模块配置 modules

- 逐一加载模块

---

## 模块化

- 开发者的任务是开发和配置模块
- 模块分为两种：标准模块和代理模块

---

## 标准模块

- 标准模块包含两个基本部分，服务和路由，路由是可选的
- 服务器加载模块时，检查模块中包含 router 函数，自动启用路由，即约定式路由

--

### 模块例子，无路由

```
module.exports = function(opts) {
    const service = {
        version: '1.0.0',

        hello: function() {
            return 'hello'
        }
    }
    return service
}
```

--

### 模块例子，有路由

```
const MS = require('jm-ms-core');
const ms = new MS();

// 定义router
const router = function () {
    var service = this; // 这里通过this可以获得service示例
    var router = ms.router()

    // 定义一条路由
    router.add('/help', 'get', opts => {
        return {
            version: service.version,
            hello: service.hello()
        }
    })

    return router
}

module.exports = function(opts) {
    const service = {
        version: '1.0.0',

        hello: function() {
            return 'hello'
        }
    }

    //router 可选
    service.router = router

    return service
}
```

--

### 标准模块配置

```javascript
{
    key: {
        prefix: '前缀',
        module: 'jm-ms-message', // 模块名或者模块路径
        config: {}
    }
}
```

---

## 代理模块

- proxy 路由转发，只支持 application/json
- httpProxy 直接转发，没有限制

--

### proxy 配置

- 优点：
- 缺点：只支持 application/json

```javascript
{
    key: {
      prefix: '前缀',
      proxy: 'http://localhost/config' // 路由转发
    }
}
```

--

### httpProxy 配置

作为 proxy 的补充，无法用 proxy 实现时才使用

```javascript
{
    key: {
      prefix: '前缀',
      changeOrigin: false, // 是否跨域
      httpProxy: 'http://localhost/config', // 直接转发
    }

}
```

---

## 配置

配置参数支持2种方式。

- 通过配置文件 config/index.js。
- 通过环境变量，主要是为了方便Docker化部署。

--

### 主要配置项

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|debug|false|是否打开调试模式
|port|3000|监听端口
|host|'0.0.0.0'|监听的IP地址
|prefix||Uri前缀
|trust_proxy|false|是否传递IP地址
|lng||语言
|max_body_size|'100kb'|设置允许请求的body的大小, 例如 '5mb'

--

### 其他配置项

maxcpus 只支持环境变量设置, 默认全部

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|maxcpus||cluster模式cpu数量
|no_auto_init|false|是否禁止自动初始化，
|no_auto_open|false|是否禁止自动监听

--

### 配置例子

config/index.js

```javascript
module.exports = {
  port: 80, // 端口
  // ....
  modules: { // 模块配置
    '': { // key， 模块唯一标识
      module: 'jm-ms-message', // 模块名或者模块路径
      prefix: uri_prefix // 默认为key
      config: {}  // 可选, 模块配置, 默认采用全局配置
    },
    config: {
      module: process.cwd() + '/lib' // 模块路径
    },
    oms: {
      proxy: 'http://localhost/oms' // 路由转发
    },
    pay: {
      httpProxy: 'http://localhost/pay', // 直接转发
      prefix: '/pay'
    }
  }
}
```
