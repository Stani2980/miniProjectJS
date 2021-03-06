var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var process = require('process');
var cors = require('cors')
const graphqlHTTP = require('express-graphql');

const { schema, resolvers } = require('./model/graphqlStuff');


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
app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/friendfinder', indexRouter);
app.use('/friendfinder/api', apiRouter);
app.use('/friendfinder/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: app.get('env') === 'development',
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
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
