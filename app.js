var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var RiakPBC = require('riakpbc');
var riak = RiakPBC.createClient(/* options */);
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var myPeople = require('./routes/mypeople');
var find = require('./routes/find');
var deleteBucket = require('./routes/delete');
var request = require('./routes/request');

var app = express();
app.use(session({cookie: {maxAge: 30*60*1000}, secret: 'This is a secret', resave: true, saveUninitialized: true}));
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define routes here
app.use('/', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/mypeople', myPeople);
app.use('/find', find);
app.use('/delete', deleteBucket);
app.use('/request', request);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/** Riak Testing **/

// var keys = riak.getKeys({ bucket: 'apptest' }, function(err, response) {
//     if (err) {
//         console.error('An error occurred:', err);
//     }
//     if (response) {
//       response.keys.forEach(function(key) {
//         riak.get({bucket: 'apptest', key: key}, function (err, rep) {
//           console.log('Key: ', key, err?err:rep);
//         });
//       });
//     }
// });


// var request = {
//         bucket: 'apptest',
//         key: 'helloworld',
//         content: {
//             test: 'Hello World!'
//         }
//     };


//riak.del({bucket: 'apptest', key: 'helloworld'}, function (err, rep) {
//    console.log('Deleted object', err?err:rep);
//});

//riak.put(request, function (err, rep) {
//    console.log('Inserted object (PUT)', err, rep);
//});

//riak.get({bucket: 'apptest', key: 'helloworld'}, function (err, rep) {
//    console.log('Found object (GET)', err, rep);
//});


module.exports = app;
