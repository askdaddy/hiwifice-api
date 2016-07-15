/**
 * Created by seven on 16/7/15.
 */

var request = require('request')
var assign = require('object-assign')
var crypto = require('crypto')
var qs = require('querystring')

var baseHost = 'ce.hiwifi.com'

/**
 *
 * @param {Object} defaults
 * @constructor
 */
var HiwifiApi = function (defaults) {
    this.defaults = assign({
        path: '/api.php',
        method: 'POST',
        protocol: 'https',
        baseHost: baseHost,
        a: 'GetIspList',
        m: 'info'
    }, defaults)
}

/**
 *
 * @param {Object} opts
 * @returns {string}
 */
HiwifiApi.prototype.generateUrl = function (opts) {
    opts = opts || {}
    var path = (opts.path || this.defaults.path) + '?m=' + opts.m + '&a=' + opts.a

    return (opts.protocol || this.defaults.protocol) + '://' + (opts.host || this.defaults.baseHost) + path

}

HiwifiApi.prototype.generateQueryString = function (data, opts) {
    opts = opts || this.defaults

    // alias
    var defaults = this.defaults

    var apiKey = opts.key || defaults.key
    var brand = opts.brand || defaults.brand
    var reqTime = Math.round(Date.now() / 1000)

    var dataJson = JSON.stringify(data)

    // Public params
    var param = {
        req_time: reqTime,
        brand: brand,
        query_params: dataJson,
        token: this.sign(apiKey + reqTime + dataJson)
    }
    return qs.stringify(param)
}

HiwifiApi.prototype.request = function (data, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts
        opts = this.defaults
    }
    opts = opts || this.defaults
    callback = callback || Function.prototype

    var url = this.generateUrl(opts)
    var method = (opts.method || this.defaults.method).toUpperCase()
    var dataStr = this.generateQueryString(data, opts)
    var option = {url: url, method: method, json: true, strictSSL: false}

    if (method === 'POST') {
        option.form = qs.parse(dataStr)
    }

    request(option, function (error, response, body) {
        callback(error, body)
    })
}


HiwifiApi.prototype.sign = function (str) {
    var hash = crypto.createHash('md5')
    return hash.update(str).digest('hex')
}


module.exports = HiwifiApi