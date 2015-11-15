/**
 * @class device
 * @classdesc ��Ա
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
 * ��ȡ�豸�б�
 * @param {Object} [option=null] ����
 * @param {Number} [option.type=2] ��ѯ���͡�1����ѯ�豸id�б��е��豸��2����ҳ��ѯ�����豸��Ϣ��3����ҳ��ѯĳ������������豸��Ϣ
 * @param {Object} [option.device_identifiers] ָ�����豸 �� ��typeΪ1ʱ������Ϊ����
 * @param {Number} [option.device_identifiers.device_id] �豸��ţ�������UUID��major��minor����ɲ����豸��ţ������߶�������豸���Ϊ���ȣ���ѯָ���豸ʱ�����β�ѯ���豸�������ܳ���50��
 * @param {Number} [option.device_identifiers.UUID]  UUID ������Ϣ����д�������������豸��ţ���ɲ������Ϣ����ѯָ���豸ʱ�����β�ѯ���豸�������ܳ���50��
 * @param {Number} [option.device_identifiers.major]  major ������Ϣ����д�������������豸��ţ���ɲ������Ϣ����ѯָ���豸ʱ�����β�ѯ���豸�������ܳ���50��
 * @param {Number} [option.device_identifiers.minor]  minor ������Ϣ����д�������������豸��ţ���ɲ������Ϣ����ѯָ���豸ʱ�����β�ѯ���豸�������ܳ���50��
 * @param {Number} [option.apply_id]  ����ID�������豸IDʱ�����ص�����ID����typeΪ3ʱ������Ϊ����
 * @param {Number} [option.begin=0]        �豸�б����ʼ����ֵ
 * @param {Number} [option.count=50]        ����ѯ���豸���������ܳ���50��
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