router
======

路由式编程模式

## 函数 fn

3个特点

* 输入参数为对象 opts

* 函数可以对 opts 进行修改

* 函数执行结果可以有返回值，也可以没有返回值


```
function fn1(opts={}){
}

// 或者

async function fn2(opts={}){
}
```

## 路由 Route

### 构造函数

接收一个或者多个函数作为参数

```
new Route(fn)

new Route([fn1, fn2]])

new Route(fn1, fn2)

```

### async function execute(opts={})

路由执行

顺序执行route中的函数，如果任一函数有返回值，则中断执行过程，并返回该值

```
let fn = () => {
    return {ret: 1}
}

let route = new Route(fn)

// async
let doc = await route.execute()

// 或者
route.execute()
    .then(doc=>{})
    .catch(e=>{})

```