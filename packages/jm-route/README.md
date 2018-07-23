---
theme : "white"
---

# jm-route

### 路由式编程模式

别名：流水线式编程模式

<small>作者：[鱼哥](https://github.com/jammacn)</small>

---

## 两个概念

- 工序函数 fn

- 路由 Route

---

## 工序函数 fn

- 成品函数

- 加工函数

- 混合函数

--

### 成品函数

执行完成时返回值

```
function fn1(){
    return {name: '鱼哥'}
}
```

--

### 加工函数

执行完成时不返回值

```
function fn1(opts){
    if(opts.name) return // 可以 return 但不返回任何值
    opts.name = '鱼哥'
}
```

--

### 混合函数

成品函数和加工函数的混合写法

```
function fn1(opts){
    if(opts.name) return {name: opts.name}
    opts.name = '鱼哥'
}
```

--

### 支持异步函数

```
function async fn1(opts){
    if(opts.name) return {name: opts.name}
    opts.name = '鱼哥'
}
```

---

## 路由 Route

一个以上工序函数的组合

--

### 构造函数

接受一个以上函数作为参数

```
new Route(fn)

new Route([fn1, fn2, ..., fnn]])

new Route(fn1, fn2, ..., fnn)

```

--

### 路由执行 execute

- 顺序执行 route 中的函数

- 遇到结果返回 promise

--

### 配置参数

- logging 是否打印日志，默认false

- benchmark 是否计算耗时，默认false

---

## 例子

--

### 最小例子

```
// 成品函数
let fn = () => {
    return {ret: 1}
}

// 创建路由
let route = new Route(fn)
route.logging = true // 打开日志
route.benchmakr = true // 打开耗时计算

// 路由执行
let doc = await route.execute()

```

--

### 最小例子 async

```
// 成品函数
let fn = async () => {
    return {ret: 1}
}

// 创建路由
let route = new Route(fn)

// 路由执行
let doc = await route.execute()

```

--

### 工序函数

```
let filter1 = () => {
    console.log('加工函数')
}
let filter2 = async () => {
    console.log('异步加工函数')
}
let fn = async () => {
    return {ret: 1}
}
let route = new Route(filter1, filter2,fn)
let doc = await route.execute()

```

---

## 已知问题

- 异步函数比同步函数慢10倍
