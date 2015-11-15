/**
 * @class message
 * @classdesc 成员
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
 * 发送文本消息
 * @param {Object} [option=null] 参数
 * @param {String} [option.touser] 成员ID列表（消息接收者，多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为@all，则向关注该企业应用的全部成员发送
 * @param {String} [option.toparty] 部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
 * @param {String} [option.totag] 标签ID列表，多个接收者用‘|’分隔。当touser为@all时忽略本参数
 * @param {String} option.msgtype=text 消息类型，此时固定为：text
 * @param {Number} option.agentid 企业应用的id，整型。可在应用的设置页面查看
 * @param {String} option.text.content 消息内容
 * @param {Number} option.safe 表示是否是保密消息，0表示否，1表示是，默认0
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
 * 验证发送对象
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
        err = new Error('没有发送对象!')
        console.error(err);
        return cb(err);
    }
    if (option.msgtype == 'text' && (!option.hasOwnProperty('text') || !option.text.hasOwnProperty('content'))) {
        err = new Error('没有发送消息体!');
        console.error(err);
        return cb(err);
    }
    cb();
}

/**
 * 发送消息
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