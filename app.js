var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const routes = require("./routes");
var session = require("express-session");
var logger = require('morgan');

var passport = require("./config/passport");

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

var db = require("./models");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// We need to use sessions to keep track of our user's login status
app.use(session({ 
  secret: "keyboard cat", 
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/', require('./routes'));
app.use(routes);

module.exports = app;
