var request = require("request");

var httpHelper = {};

module.exports = httpHelper;

function init(server) {
    server.use(function (req, res, next) {
        req.getParams = function (key) {
            if (req.body && req.body[key]) {
                return req.body[key];
            }
            if (req.params && req.params[key]) {
                return req.params[key];
            }
            if (req.query && req.query[key]) {
                return req.query[key];
            }
            return "";
        };
        next();
    });
}
httpHelper.init = init;

/**
 * post 请求
 * @param url
 * @param option
 * @param next
 */
httpHelper.post = function (url, option, next) {
    if (typeof option == "function") {
        next = option;
        option = null;
    }
    var postData = {
        headers: {"Content-type": "application/json"},
        url: url,
        method: 'POST',
        json: true,
        form: option
    };
    request(postData, function (err, response, body) {
        next(err, response, body);
    });
};


httpHelper.post1 = function (url, option, next) {
    if (typeof option == "function") {
        next = option;
        option = null;
    }
    request.post(url, {form: option}, function (err, response, body) {
        if (err) {

        }
        if (typeof next == 'function') {
            next(err, response, body);
        }
    })
};

/**
 * get 请求
 * @param url
 * @param queryString
 * @param next
 */
httpHelper.get = function (url, queryString, next) {
    if (typeof queryString == 'function') {
        next = queryString;
        queryString = null;
    }
    var option = {
        url: url
    };
    if (option) {
        option.qs = queryString;
    }
    request(option, function (err, response, body) {
        next(err, response, body);
    });
};

/**
 * 转发请求
 * @param {String} url   转发URL
 * @param {Object} req   请求对象
 * @param {Object} res   响应对象
 * @param {String} [stat]  添加回传值
 * @param {Function} next  回调
 */
function pipe(url, req, res, stat, next) {
    if (typeof stat == 'function') {
        next = stat;
        stat = null;
    }
    if (stat) {
        //带参数做处理
        request({url: url}, function (err, _res) {
            if (err) {
                return res.json(new Error("转发错误"));
            }
            var json = JSON.parse(_res.body);
            res.json(json);
            next(json);
        });
    }
    else {
        console.log("url", url);
        //不带参数 直接转发
        req.pipe(request({url: url}, function (err, _res) {
            if (err) {
                return console.error(err);
            }
            var json;
            try {
                json = JSON.parse(_res.body);
            } catch (e) {
                console.debug("body", _res.body);
                return console.error("e", e);
            }
            console.debug(json);
            next(json);
        })).pipe(res);
    }
}
httpHelper.pipe = pipe;