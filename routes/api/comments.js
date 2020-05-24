var db = require("../../models");
var express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var router = express.Router();

// Return all comments
router.get('/', function(req, res) {

})

// Submit a comment
router.post('/', function(req, res) {
  // Get the content of the comment, and the post it's for.
  const { PostId, content } = req.body;

  db.Comment.create({
    UserId: req.user.id,
    PostId,
    content
  }).then(dbComment => {
    console.log("\n\nIn comment post route. Create resolves.\n\n")
    res.json(dbComment)
  }).catch(err => {
    res.json(err)
  })
})

module.exports = router;