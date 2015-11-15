/**
 * @class user
 * @classdesc ��Ա
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
 * ��ȡ���г�Ա
 * @param {Object} [option=null] ����
 * @param {Number} [option.department_id=1] ����ID
 * @param {Number} [option.fetch_child=1] 1/0���Ƿ�ݹ��ȡ�Ӳ�������ĳ�Ա
 * @param {Number} [option.status=1] 0��ȡȫ��Ա����1��ȡ�ѹ�ע��Ա�б�2��ȡ���ó�Ա�б�4��ȡδ��ע��Ա�б�status�ɵ���
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