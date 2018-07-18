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

## 函数组合 compose

多个函数可以组合成一个函数

```
function fn1(opts={}){
}

async function fn2(opts={}){
}

let fn = compose(fn1, fn2)
```


## 路由 Route

### async function execute(opts={})

路由执行
