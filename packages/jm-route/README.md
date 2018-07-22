---
theme : "white"
---

# jm-route

### 路由式编程模式

<small>作者：[鱼哥](https://github.com/jammacn)</small>

---

## 两个概念

- 函数 fn

- 路由 Route

---

## 函数 fn

- 结果函数

- 过滤器函数

- 混合函数

--

### 结果函数

执行完成时返回值

```
function fn1(){
    return {name: '鱼哥'}
}
```

--

### 过滤器函数

执行完成时不返回值

```
function fn1(opts){
    if(opts.name) return // 可以 return 但不返回任何值
    opts.name = '鱼哥'
}
```

--

### 混合函数

结果函数和过滤器函数的混合写法

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

一个以上函数的组合

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

- 返回 promise

- 顺序执行 route 中的函数

- 如果任一函数有返回值，则中断执行过程，并返回该值

---

## 例子

--

### 最小例子

```
// 结果函数
let fn = () => {
    return {ret: 1}
}

// 创建路由
let route = new Route(fn)

// 路由执行
let doc = await route.execute()

```

--

### 最小例子 async

```
// 结果函数
let fn = async () => {
    return {ret: 1}
}

// 创建路由
let route = new Route(fn)

// 路由执行
let doc = await route.execute()

```

--

### 过滤器

```
let filter1 = () => {
    console.log('过滤函数')
}
let filter2 = async () => {
    console.log('异步过滤函数')
}
let fn = async () => {
    return {ret: 1}
}
let route = new Route(filter1, filter2,fn)
let doc = await route.execute()

```
