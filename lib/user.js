/**
 * @class user
 * @classdesc 成员
 * <br/> Created by Zore on 2015/11/6.
 */
var user = {};
var util = require('util'),
    accessToken = require('./access_token'),
    hpHelper = require('../utils/http_helper');
/**
 * @private
 */
var config = helper.config;

exports = module.exports = user;

/**
 * 获取所有成员
 * @param {Object} [option=null] 参数
 * @param {Number} [option.department_id=1] 部门ID
 * @param {Number} [option.fetch_child=1] 1/0：是否递归获取子部门下面的成员
 * @param {Number} [option.status=1] 0获取全部员工，1获取已关注成员列表，2获取禁用成员列表，4获取未关注成员列表。status可叠加
 * @param cb
 */
user.getAllUser = function (option, cb) {
    accessToken.getAccessToken(function (err, token) {
        if (!err) {
            if (typeof option == 'function') {
                cb = option;
                option = {};
            }
            option.department_id = util.isEmpty(option.department_id) ? 1 : option.department_id;
            option.fetch_child = util.isEmpty(option.fetch_child) ? 1 : option.fetch_child;
            option.status = util.isEmpty(option.status) ? 0 : option.status;

            var param = {
                access_token: token,
                department_id: option.department_id,
                fetch_child: option.fetch_child,
                status: option.status
            };
            hpHelper.get(config.wechat_url.getAllUser, param, function (err, res, body) {
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