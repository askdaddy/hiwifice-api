/**
 * Created by seven on 16/7/15.
 */
var assert = require('assert')
var Hiwifi = require('../')
var conf = require('./config.json')
var Cron = require('node-cron')


var api = new Hiwifi({
    brand: conf.brand,
    key: conf.key
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
    var taskid, tickCount = 0, res, task
    if (0 === data.code) {
        taskid = data.data.taskid
        task = Cron.schedule('*/2 * * * * *', function () {
            console.log('Does query task results ', tickCount);

            api.request({"taskid": taskid}, {a: 'GetCallback', m: 'query'}, function (e, d) {
                if (!e && 0 == d.code) {
                    if (Number(d.data.now_num) == Number(d.data.send_num)) {
                        console.log(d)
                        task.stop()
                    }
                }
                res = d
                tickCount++
                if (tickCount > 30) { // exit after 2*30 seconds
                    console.log(res)
                    task.stop()
                }
            })


        });
    }

})