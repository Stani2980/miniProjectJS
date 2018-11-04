var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var process = require('process');


/// TRICK TO RUN IN TEST ENVORIMENT
if (process.argv[2]) {
  require('./dbSetup')(require('./settings').TEST_DB_URI);
} else {
  require('./dbSetup')();
}

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//THIS SHOULD DO MAGIC TO UNHANDLED REJECTIONS
// process.on('unhandledRejection', (reason, promise) => {
//   console.log('Unhandled Rejection at:', reason.stack || reason)

// })

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page or return json error
  if (req.url.startsWith('/api')) {
    // create JSON response
    err.status = err.status || 500;
    res.json(res.locals)
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
