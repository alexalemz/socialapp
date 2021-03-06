const path = require("path");
var express = require('express');
var router = express.Router();

// API Routes
router.use('/api', require('./api'));

// Notification Routes
router.use('/notifications', require('./notifications'));

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
