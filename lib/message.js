/**
 * @class message
 * @classdesc ��Ա
 * <br/> Created by Zore on 2015/11/6.
 */
var message = {};
var util = require('util'),
    accessToken = require('./access_token'),
    hpHelper = require('../utils/http_helper');
/**
 * @private
 */
var config = helper.config;

exports = module.exports = message;

/**
 * �����ı���Ϣ
 * @param {Object} [option=null] ����
 * @param {String} [option.touser] ��ԱID�б���Ϣ�����ߣ�����������á�|���ָ������֧��1000���������������ָ��Ϊ@all�������ע����ҵӦ�õ�ȫ����Ա����
 * @param {String} [option.toparty] ����ID�б�����������á�|���ָ������֧��100������touserΪ@allʱ���Ա�����
 * @param {String} [option.totag] ��ǩID�б�����������á�|���ָ�����touserΪ@allʱ���Ա�����
 * @param {String} option.msgtype=text ��Ϣ���ͣ���ʱ�̶�Ϊ��text
 * @param {Number} option.agentid ��ҵӦ�õ�id�����͡�����Ӧ�õ�����ҳ��鿴
 * @param {String} option.text.content ��Ϣ����
 * @param {Number} option.safe ��ʾ�Ƿ��Ǳ�����Ϣ��0��ʾ��1��ʾ�ǣ�Ĭ��0
 * @param cb
 *
 * @example {
 *      "touser": "jay.zhou",
 *      "toparty": " PartyID1 | PartyID2 ",
 *      "totag": " TagID1 | TagID2 ",
 *      "msgtype": "text",
 *      "agentid": "1",
 *      "text": {
 *          "content": "Holiday Request For Pony(http://xxxxx)"
 *      },
 *      "safe":"0"
 * }
 */
message.sendText = function (option, cb) {
    verify(option, function (err) {
        if (!err) {
            option.agentid = util.isEmpty(option.agentid) ? "3" : option.agentid;
            option.msgtype = 'text';
            send(option, cb);
        }
    });
};

/**
 * ��֤���Ͷ���
 * @param option
 * @param cb
 * @returns {*}
 */
function verify(option, cb) {
    var err;
    if (util.isEmpty(option.touser) &&
        util.isEmpty(option.toparty) &&
        util.isEmpty(option.totag)
    ) {
        err = new Error('û�з��Ͷ���!')
        console.error(err);
        return cb(err);
    }
    if (option.msgtype == 'text' && (!option.hasOwnProperty('text') || !option.text.hasOwnProperty('content'))) {
        err = new Error('û�з�����Ϣ��!');
        console.error(err);
        return cb(err);
    }
    cb();
}

/**
 * ������Ϣ
 * @param body
 * @param cb
 * @private
 */
function send(body, cb) {
    accessToken.getAccessToken(function (err, token) {
        if (!err) {
            if (typeof option == 'function') {
                cb = option;
                option = {};
            }
            var param = {
                access_token: token,
                body: JSON.stringify(body),
                debug: 1
            };
            //{"touser":"jay.zhou","text":{"content":"test(http://www.baidu.com)"},"agentid":"3","msgtype":"text"}
            hpHelper.post1(config.wechat_url.sendMessage, param, function (err, res, body) {
                if (err) {
                    console.debug('param', param);
                    console.debug('body', body);
                    console.error('err', err);
                    return cb(err);
                }
                var json;
                try {
                    json = JSON.parse(body);
                }
                catch (e) {
                    console.debug('param', param);
                    console.debug('body', body);
                    console.error(err);
                    return cb(err);
                }
                if (json.errcode > 0) {
                    console.debug('param', param);
                    console.debug('body', body);
                    err = new Error(json.errmsg);
                    console.error(err);
                    return cb(err);
                }
                cb(null, json);
            });
        }
    });
}