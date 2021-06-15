# jm-ms-session

session lib for jm-ms-core.

表示服务器和客户端连接上的一个会话.

## 约定

消息内容采用 json 格式，支持两种通讯方式，请求/响应和通知。

### 请求/响应
请求格式
{
id,
uri,
headers, // 可选
data  // 可选
}
响应格式
{
id,
data // 可选
}
### 通知
通知格式跟请求格式类似，唯一区别是没有id
{
uri,
headers,
data
}
通知无需响应。
