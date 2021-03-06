//var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const indexRouter = require('./routes/index');
const submissionRouter = require('./routes/submission');
const adminRouter = require('./routes/admin');
// const activationRouter = require('./routes/activation');
const session = require("express-session");
const app = express();

app.use(express.static('public'));

//session
app.use(cookieParser('1234'));
app.use(session({
    name: '_user_cookie',
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 24 * 3600 * 1000}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/submission', submissionRouter);
app.use('/admin', adminRouter);
// app.use('/activation', activationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
