/**
 * @class device
 * @classdesc 成员
 * Created by Zore on 2015/11/16.
 */
var device = {};
var util = require('util'),
    accessToken = require('./access_token'),
    hpHelper = require('../utils/http_helper');

/**
 * @private
 */
var config = helper.config;

exports = module.exports = device;

/**
 * 获取设备列表
 * @param {Object} [option=null] 参数
 * @param {Number} [option.type=2] 查询类型。1：查询设备id列表中的设备；2：分页查询所有设备信息；3：分页查询某次申请的所有设备信息
 * @param {Object} [option.device_identifiers] 指定的设备 ； 当type为1时，此项为必填
 * @param {Number} [option.device_identifiers.device_id] 设备编号，若填了UUID、major、minor，则可不填设备编号，若二者都填，则以设备编号为优先；查询指定设备时，单次查询的设备数量不能超过50个
 * @param {Number} [option.device_identifiers.UUID]  UUID 三个信息需填写完整，若填了设备编号，则可不填此信息；查询指定设备时，单次查询的设备数量不能超过50个
 * @param {Number} [option.device_identifiers.major]  major 三个信息需填写完整，若填了设备编号，则可不填此信息；查询指定设备时，单次查询的设备数量不能超过50个
 * @param {Number} [option.device_identifiers.minor]  minor 三个信息需填写完整，若填了设备编号，则可不填此信息；查询指定设备时，单次查询的设备数量不能超过50个
 * @param {Number} [option.apply_id]  批次ID，申请设备ID时所返回的批次ID；当type为3时，此项为必填
 * @param {Number} [option.begin=0]        设备列表的起始索引值
 * @param {Number} [option.count=50]        待查询的设备数量，不能超过50个
 * @param cb
 */
device.getDevice = function (option, cb) {
    accessToken.getAccessToken(function (err, token) {
        if (!err) {
            if (typeof option == 'function') {
                cb = option;
                option = {
                    type: 2,
                    begin: 0,
                    count: 50
                };
            }
            option.type = util.isEmpty(option.type) ? 2 : option.type;
            option.begin = util.isEmpty(option.begin) ? 0 : option.begin;
            option.count = util.isEmpty(option.count) ? 50 : option.count;

            var param = {
                access_token: token,
                type: option.type,
                begin: option.begin,
                count: option.count
            };
            hpHelper.get(config.wechat_url.getDevices, param, function (err, res, body) {
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