const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const session = require('express-session');
const nocache = require('nocache');

const database = require('./config/connections');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine(
  {
    helpers:
    {
      not: value => !value,

      inc: function (value) {
        return parseInt(value) + 1;
      },
      cancelled: function (value) {
        if (value === 'Cancelled') {   //For cancel button
          return true;
        } else {
          return false;
        }
      },
      delivered: (value) => {
        if (value === 'Delivered') {    //For cancel button
          return true;
        } else {
          return false;
        }
      },
      rejected: (value) => {
        if (value === 'Rejected') {
          return true;
        } else {
          return false;
        }
      },

      shipped: (value) => {
        if (value === 'Shipped') {
          return true;
        } else {
          return false;
        }
      },

      outForDelivery: (value) => {
        if (value === 'Out For Delivery') {
          return true;
        } else {
          return false;
        }
      },

      delivered: (value) => {
        if(value === 'Delivered'){
          return true;
        }else{
          return false;
        }
      },
      upi: (value) => {
        if(value === 'UPI'){
          return true;
        }else{
          return false;
        }
      } 
    },

    extname: 'hbs', defaultLayout: 'user-layout', layoutsDir: __dirname + '/views/layout/'
  }))

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:
  {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(nocache());

app.use('/', userRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('user/error', { layout: 'layout' });
});

module.exports = app;
