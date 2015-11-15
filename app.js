var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

app.disable("x-powered-by");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/test', function (req, res) {
    console.dir(req.body);
    res.json(req.body);
});

app.all('/index', function (req, res) {
    require('request').post({
        headers: {"Content-type": "application/json"},
        //url: 'http://127.0.0.1:13000/test',
        url: 'https://qyapi.weixin.qq.com/cgi-bin/shakearound/getshakeinfo?access_token=4hcHB_XflZOoKeWOESaH8t6Je5dPDX_F1jzEVkevcmuHeq17niu_cN0ig1q1V80ElbJs6WiWr9SeOcpjN6jIZQ',
        "content-type": "application/json",
        body: new Buffer(JSON.stringify({
            "ticket": req.query.ticket,
            "debug": 1
        }))
    }, function (err, response, body) {
        if (err) {
            console.error(err);
            return res.json(err);
        }
        var json;
        try {
            json = JSON.parse(body);
        }
        catch (e) {
            console.error(err);
            return res.json(err);
        }
        console.dir(json);
        res.json(json);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
