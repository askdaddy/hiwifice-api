Hiwifi ce API SDK for node.js
==================================

`hiwifice-api` 是极路由Lastmile探针的 node.js SDK 工具包.

安装
----

```bash
npm i hiwifice-api --save
```

使用
----

1.	获得极路由探针 brand 和 key
2.	安装并引入本 SDK.

示例
----

```js
var Hiwifi = require('hiwifice-api')

var api = new Hiwifi({
    brand: "Your brand here",
    key: "Your key here"
})

// 默认调用GetIspList
api.request({}, function (error, data) {
    console.log(error, data)
})
// 获取运营商列表,和上面等价
api.request({}, {a: 'GetIspList', m: 'info'}, function (error, data) {
    console.log(error, data)
})

// 获取省份列表
api.request({}, {a: 'GetRegionList', m: 'info'}, function (error, data) {
    console.log(error, data)
})

// 发任务
api.request({
    "region_id": 310000,
    "isp_id": 100017,
    "num": 1,
    "action": "ping",
    "host": "www.baidu.com",
    "cnt": 4
}, {a: 'Query', m: 'query'}, function (error, data) {
    console.log(error, data)
})

// 查询探测结果
api.request({
    "taskid": "Task id"
}, {a: 'GetCallback', m: 'query'}, function (error, data) {
    console.log(error, data)
})

```

