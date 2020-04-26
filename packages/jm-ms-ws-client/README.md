# jm-ms-ws-client

websocket client plugin for jm-ms-core

## adapter

参考 WebSocket 实现

## client events

- connect
start connect to server.

- open
successful connected to server.

- close
disconnected from server.

- error
get an error.

- message
recevied a message.

## <a name="参数">参数</a>

- jm-net

- jm-ms-ws-client

--

### jm-net

请参考 [jm-net](https://github.com/jm-root/core/tree/master/packages/jm-net)

--

### jm-ms-ws-client

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|uri||uri|
|timeout|[60000]|请求超时|
|logger|[]|日志实例|

---