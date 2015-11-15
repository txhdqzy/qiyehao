/**
 * logger
 * @author: Zore
 * @date: 14-4-16 下午12:02
 */
//ALL: new Level(Number.MIN_VALUE, "ALL"),
//TRACE: new Level(5000, "TRACE"),
//DEBUG: new Level(10000, "DEBUG"),
//INFO: new Level(20000, "INFO"),
//WARN: new Level(30000, "WARN"),
//ERROR: new Level(40000, "ERROR"),
//FATAL: new Level(50000, "FATAL"),
//OFF: new Level(Number.MAX_VALUE, "OFF"),
//toLevel: toLevel
var log4js = require('log4js'),
    logger = function (level) {
        level = level || 'INFO';
        var logFolder = getFolderPath();

        log4js.configure({
            appenders: [
                { type: 'console' },
                {
                    type: 'dateFile',
                    filename: logFolder + 'log.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024 * 20,
                    alwaysIncludePattern: false,
                    backups: 4,
                    level: level,
                    category: 'log'
                },
                {
                    type: 'dateFile',
                    filename: logFolder + 'log_debug.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024 * 20,
                    alwaysIncludePattern: false,
                    backups: 4,
                    level: level,
                    category: 'logdebug'
                },
                {
                    type: 'dateFile',
                    filename: logFolder + 'log_info.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024 * 20,
                    alwaysIncludePattern: false,
                    backups: 4,
                    level: level,
                    category: 'loginfo'
                },
                {
                    type: 'dateFile',
                    filename: logFolder + 'log_error.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024 * 20,
                    alwaysIncludePattern: false,
                    backups: 4,
                    level: level,
                    category: 'logerror'
                },
                {
                    type: 'dateFile',
                    filename: logFolder + 'log_fatal.log',
                    pattern: "_yyyy-MM-dd",
                    maxLogSize: 1024 * 20,
                    alwaysIncludePattern: false,
                    backups: 4,
                    level: level,
                    category: 'logfatal'
                }
            ]
        });
        log4js.setGlobalLogLevel(level);
        replaceConsole.call(this);
        this.log4js = log4js;
    },
    fs = require('fs'),
    path = require('path');

module.exports = logger;

//替换标准输出函数
function replaceConsole() {
    function replaceWith(fn) {
        var logger = this;
        return function () {
            fn.apply(logger, arguments);
        };
    }

    //logger = logger || getLogger("console");
    var self = this;
    ['log', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(function (item) {
        if (typeof self[item] == "function") {
            console[item] = self[item];
            //console[item] = replaceWith.call(loggers[item], loggers[item][item]);
        }
    });
}

//获得目录位置
function getFolderPath() {
    var ph = path.join(helper.basedir, 'logs/');
    if (!fs.existsSync(ph)) {
        fs.mkdirSync(ph);
    }
    return ph;
}

function getLogger(name) {
    if (!name)  name = "log";
    return log4js.getLogger(name);
}
logger.prototype.getLogger = getLogger;

logger.prototype.debug = function () {
    var logger = getLogger("logdebug");
    logger.debug.apply(logger, arguments);
};
logger.prototype.trace = logger.prototype.debug;

logger.prototype.log = function () {
    var logger = getLogger("loginfo");
    logger.info.apply(logger, arguments);
};
logger.prototype.info = logger.prototype.log;

logger.prototype.error = function () {
    var logger = getLogger("logerror");
    logger.error.apply(logger, arguments);
};
logger.prototype.warn = logger.prototype.error;

logger.prototype.fatal = function () {
    var logger = getLogger("logfatal");
    logger.fatal.apply(logger, arguments);
};