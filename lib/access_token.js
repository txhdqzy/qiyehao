/**
 * @class accessToken
 * @classdesc 程序链接凭证
 * <br/> Created by Zore on 2015/11/6.
 */
var accessToken = {};
var cache = require('memory-cache'),
    hpHelper = require('../utils/http_helper');

exports = module.exports = accessToken;
/**
 * 获取access_token
 * @param cb
 */
accessToken.getAccessToken = function (cb) {
    var access_token = cache.get('access_token');
    if (access_token) {
        return cb(null, access_token);
    }
    var config = helper.config,
        url = config.wechat_url.getAcessToken;
    hpHelper.get(url, config.app_key, function (err, res, body) {
        if (err) {
            console.error(err);
            return cb(err);
        }
        var json;
        try {
            json = JSON.parse(body);
        }
        catch (e) {
            console.error(err);
            return cb(err);
        }
        cache.put('access_token', json.access_token, json.expires_in * 1000);
        cb(null, json.access_token);
    });
}