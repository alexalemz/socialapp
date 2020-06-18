var db = require("../../models");
var Sequelize = require("sequelize");

const passport = require("../../config/passport");

const Op = Sequelize.Op;

var express = require('express');
var router = express.Router();

const userRoutes = require("./users");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");

// Test
router.get('/', function(req, res) {
  res.send("API");
})

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/login", passport.authenticate("local"), function(req, res) {
  // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
  // So we're sending the user back the route to the members page because the redirect will happen on the front end
  // They won't get this or even be able to access this page if they aren't authed
  // res.json("/members");
  // res.json("Login successful");

  res.json("/");
});

// Route for registering a new user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/register", function(req, res) {
  console.log(req.body);
  const { email, username, password } = req.body;
  // The default picture is the silhouette (which is already in Cloudinary)
  const picture = `{"id":"ysotg2rmmqayehlg3bzq","url":"http://res.cloudinary.com/dewsvrayk/image/upload/v1573259071/ysotg2rmmqayehlg3bzq.png"}`;
  db.User.create({
    email,
    username,
    password,
    picture
  }).then(function() {
    res.redirect(307, "/api/login");
  }).catch(function(err) {
    console.log(err);
    res.json(err);
    // res.status(422).json(err.errors[0].message);
  });
});

// Route for logging user out
router.get("/logout", function(req, res) {
  req.logOut();
  // Destroy the session, clear the cookies, and redirect to root.
  req.session.destroy(function(err) {
    res.clearCookie('connect.sid', {path: '/'});
    res.redirect('/');
  });
});

// Route for getting some data about our user to be used client side
router.get("/user_data", function(req, res) {
  if (!req.user) {
    // The user is not logged in, send back an empty object (actually, empty strings for the keys)
    // res.json({});
    res.json({
      email: '',
      username: '',
      id: ''
    })
  }
  else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      username: req.user.username,
      id: req.user.id
    });
  }
});

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
