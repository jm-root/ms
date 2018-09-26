---
theme : "white"
---

# ms core

MicroService core lib

设计目标
- 支持uri匹配
- 支持函数链
- proxy
- client
- server

## Route

--

## Matcher

匹配器，用于更换匹配规则

--

## 路由器 router

---

### use

---

### add

---

### clear

---

### execute

---

### request

---

### request 错误拦截

- sdk.on('error')

```js

sdk.on('error', (e, opts)=>{
  console.log(e) // 纸打印错误，不拦截结果
})

sdk.on('error', (e, opts)=>{
  console.log(e)
  return e.data || null // 拦截错误，并给出新的返回值
})

```

---

### notify

---

## Root

--
