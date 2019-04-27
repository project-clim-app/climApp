require('dotenv').config();
const createError  = require('http-errors');

const bodyParser       = require('body-parser');
const cookieParser     = require('cookie-parser');
const express          = require('express');
const favicon          = require('serve-favicon');
const hbs              = require('hbs');
const mongoose         = require('mongoose');
const logger           = require('morgan');
const path             = require('path');
const bcrypt           = require('bcrypt');
const passport         = require('passport');
const GoogleStrategy   = require('passport-google-oauth2').Strategy;


require('./config/db.config');
require('./config/hbs.config');
const session      = require('./config/session.config');
require('./config/passport.config')

const miscRouter = require('./routes/misc.routes');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');

const app = express();


//- - - - - - - - - - 

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json()); // en ex-basic-auth hay este middleware: app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.session = req.user;
  next();
})

app.use('/', miscRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

// error handler
app.use(function(err, req, res, next) {
  // ser locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})


module.exports = app;
