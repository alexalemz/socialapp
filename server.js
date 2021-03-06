require('dotenv').config()
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const routes = require("./routes");
var session = require("express-session");
var logger = require('morgan');
const cors = require("cors");

var passport = require("./config/passport");

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

var db = require("./models");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// else {
//   app.use(express.static(path.join(__dirname, 'public')));
// }
// We need to use sessions to keep track of our user's login status
app.use(session({ 
  secret: "keyboard cat", 
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 2592000000 /* 60000 * 60 * 24 * 30 */,
    secure: false 
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

var db = require("./models");

const PORT = process.env.PORT || 3001;

db.sequelize.sync({force: false}).then(function() {
  app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
})