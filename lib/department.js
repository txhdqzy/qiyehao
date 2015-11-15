/**
 * @class department
 * @classdesc ͨѶ¼
 * <br/> Created by Zore on 2015/11/6.
 */
var department = {};
var accessToken = require('./access_token'),
    hpHelper = require('../utils/http_helper');
/**
 * @private
 */
var config = helper.config;

exports = module.exports = department;

department.getDeptList = function (cb) {
    accessToken.getAccessToken(function (err, token) {
        if (!err) {
            hpHelper.get(config.wechat_url.getDeptList, {
                access_token: token
            }, function (err, res, body) {
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
                cb(null, json);
            });
        }
    });
};