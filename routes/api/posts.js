var db = require("../../models");
var express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var router = express.Router();

// GET /api/posts
router.get('/', function(req, res) {
  // res.send("Post api");

  const { UserId, username } = req.query;
  const searchParams = {};
  if (UserId) {
    searchParams.UserId = UserId
  }
  if (username) searchParams.username = username

  console.log("UserId", UserId)
  console.log("searchParams", searchParams)
  console.log("PostsAPI Backend. req.query", req.query)
  db.Post.findAll({
    // where: searchParams,
    include: [
      {
        model: db.User,
        attributes: ['id', 'username', 'email', 'name', 'picture'],
        where: { 
          ...searchParams
        },
      }, /* { model: db.User, as: 'Liked'} */
      {association: 'Comments', },
    ],
    // Sort from newest to oldest
    order: [['createdAt', 'DESC']],
  }).then(function(dbPosts) {
    // let dbPosts2 = dbPosts.map(post => {
    //   return Object.assign({}, {...post, User: Object.assign({}, {
    //     id: post.User.id,
    //     username: post.User.username,
    //     email: post.User.email,
    //   })})
    // })

    // let dbPosts2 = dbPosts.map(post => {
    //   post.User.password = "";
    //   return post;
    // })
    // res.json(dbPosts2);

    // Add property fromCurrentUser, which indicates if the post is from the logged in user.
    dbPosts = dbPosts.map(post => {
      return {
        ...post.get({plain: true}),
        fromCurrentUser: req.user ? post.User.id === req.user.id : undefined,
      }
    })

    res.json(dbPosts);
  })
})

// Create a new post with the given data and the id of the logged-in user.
router.post('/', function(req, res) {
  console.log(req.body)
  const { content } = req.body;
  db.Post.create({
    content,
    UserId: req.user.id,
  }).then(function(dbPost) {
    console.log(dbPost);
    res.json(dbPost);
  }).catch(function(err) {
    console.log(err);
    res.json(err);
  });
})

// Get the home feed of the logged-in user. The most recent posts of their followeds.
router.get('/homefeed', function(req, res) {
  // We need to look up the followeds of the logged-in user.
  db.User.findOne({
    where: {id: req.user.id},
    attributes: ['id', 'username'],
    include: [
      {association: 'Followeds', attributes: ['id', 'username']},
    ]
  }).then(dbUser => {
    // Now dbUser.Followeds is an array of User objects. We need to create an array of just the ids.
    const followedIds = dbUser.Followeds.map(user => user.id);
    // Add the current user's id.
    followedIds.push(req.user.id);

    // Then we will find all posts by those users.
    db.Post.findAll({
      where: {
        // UserId: {
        //   [Op.or]: followedIds
        // }
        UserId: followedIds
      },
      // Sort from newest to oldest
      order: [['createdAt', 'DESC']],
      // Include the author information
      include: [
        {association: 'User', attributes: ['id', 'username', 'email', 'name', 'picture']},
        {association: 'Comments', /* attributes: ['id', 'content'] */},
      ]
    }).then(dbPosts => {
      // Add property fromCurrentUser, which indicates if the post is from the logged in user.
      dbPosts = dbPosts.map(post => {
        return {
          ...post.get({plain: true}),
          fromCurrentUser: post.User.id === req.user.id,
        } 
      })

      res.json(dbPosts)
    })

    // res.json(followedIds);
  })
})

// Get all the info/details of a particular post (such as comments, likes, etc)
router.get('/:PostId', function(req, res) {
  const { PostId } = req.params;

  db.Post.findOne({
    where: {
      id: PostId
    },
    include: [
      {association: 'User', attributes: ['id', 'username']},
      {association: 'Comments', include: [{association: 'User', attributes: ['id', 'username']}]},
    ]
  }).then(dbPost => {
    // Add a property for each comment 'fromCurrentUser' so that the user can delete their own comment.
    console.log('PostDetails for postId:', PostId, dbPost.get({plain: true}))
    // Make the record plain
    dbPost = dbPost.get({plain: true})
    dbPost.Comments = dbPost.Comments.map(comment => {
      comment.fromCurrentUser = req.user.id ? (req.user.id === comment.UserId ? true : false) : false;
      return comment;
    })
    console.log(dbPost);
    res.json(dbPost)
  })
})

// Delete a post with a given id, as long as it belongs to the logged-in user
router.delete('/:PostId', function(req, res) {
  const { PostId } = req.params;

  db.Post.destroy({
    where: {
      id: PostId,
      UserId: req.user.id,
    }
  }).then(dbPost => {
    console.log(`Post with id ${PostId} was deleted.`)
    res.json(dbPost);
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
})

module.exports = router;