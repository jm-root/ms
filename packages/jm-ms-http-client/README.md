# jm-ms-http-client

http client plugin for jm-ms-core

## adapter

实现 request 接口函数

例如

```
let adapter = {
    async request(url, data, opts){
        return {data}
    }
}

```
