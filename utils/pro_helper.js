/**
 * Created by kiwi on 14-7-28.
 */
var gb,
    path = require('path'),
    moment = require('moment'),
    util = require('util');

moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";
util.isEmpty = isEmpty;//添加注册 校验空函数

(function () {
    gb = this;
})();
var helper = function () {
    gb.helper = this;

    //项目根节点
    this.basedir = path.join(__dirname, '../');

    //初始化Log
    this.logger = new (require('./logger.js'))("DEBUG");

    //初始化配置文件
    initConfig.call(this);
};

module.exports = new helper();

function initConfig() {

    var config = this.config = require(path.join(this.basedir, "app_config", "wechat.json"));
    config.PRO_LEVEL = {
        product: 0,
        uat: 1,
        dev: 2
    };

    //通过启动环境变量配置当前级别,默认为开发版
    if (typeof process.env.P_TYPE == "undefined") {
        config.level = typeof process.env.P_TYPE == "undefined" ?
            "dev" : process.env.P_TYPE.toLowerCase();
    }
    else
        config.level = process.env.P_TYPE;
    if (!config.PRO_LEVEL.hasOwnProperty(config.level)) {
        throw new this.error.BaseError({code: 5000});
    }

    //是否可以启动自动任务,默认不开启
    config.runtask = typeof process.env.P_TASK != "undefined" && (
        process.env.P_TASK.toUpperCase() == "T" ||
        process.env.P_TASK.toLowerCase() == "true");

    //程序端口
    config.port = (15000 + config.PRO_LEVEL[config.level]);
    config.sslPort = (15010 + config.PRO_LEVEL[config.level]);
}

function isEmpty(E, e) {
    return E === null || E === undefined || ((util.isArray(E) && !E.length)) || (!e ? E === "" : false)
}