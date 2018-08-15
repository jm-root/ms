# jm-ms-wrapper

fn wrapper for jm-ms-core project

## use

```
const wrapper = require('jm-ms-wrapper')
const wrap = wrapper()
function fn(opts){
    return opts
}

fn = wrap(fn)

```
