var db = require('../../models');
var express = require('express');
var router = express.Router();

// import { upload } from '../../config/middleware/multer';
const { upload } = require('../../config/middleware/multer');

// For converting the profile picture file in memory to dataURI, so it can be uploaded to Cloudinary
const path = require('path');
const Datauri = require('datauri');
const datauri = new Datauri();

// Import the Cloudinary uploader and set the config to my account
const { cloudinaryConfig, uploader } = require('../../config/cloudinaryConfig');
cloudinaryConfig();

router.get('/', function(req, res) {
  // res.send("User api");
  const { UserId, username } = req.query;
  const searchParams = {};
  if (UserId) searchParams.UserId = UserId
  if (username) searchParams.username = username

  // console.log("UserId", typeof UserId)
  // console.log("searchParams", searchParams)
  db.User.findAll({
    where: searchParams,
    attributes: ['id', 'username', 'email', 'name', 'picture', 'bio'], // only return what we need
  }).then(function(dbUsers) {
    res.json(dbUsers);
  })
})

// Get the profile info of the user with the specified username.
// If no username is specified, it gets the logged-in user.
// Including their bio, followers, followeds, etc.
router.get('/profile', function(req, res) {
  const usernameSpecified = JSON.stringify(req.query) !== '{}';
  const { username } = usernameSpecified ? req.query : req.user;
  console.log('in get profile, req.query', req.query)

  db.User.findOne({
    where: { username },
    attributes: ['username', 'email', 'name', 'picture', 'bio'], // only return what we need
    // include: [{ model: db.User, as: 'Followed' }]
    // include: [{association: 'Followed',  attributes: ['id', 'username']}]
    // include: [{ model: db.User, through: 'Follows' }]
    include: [
      {association: 'Followers', attributes: ['username', 'name', 'picture', 'bio']}, 
      {association: 'Followeds', attributes: ['username', 'name', 'picture', 'bio']}
    ]
  }).then(dbUser => {
    console.log('dbUser', dbUser.get({plain: true}))
    // Add an attribute of whether the current user is following this user.
    // Check if req.user.username is in db.User.Followers
    const isFollowing = dbUser.Followers.some(follower => {
      return follower.username === req.user.username
    })

    const isCurrentUser = dbUser.username === req.user.username;

    // const { username, email, Followers, Followeds } = dbUser;
    // let dbUser2 = {
    //   username, email, Followers, Followeds, isFollowing, isCurrentUser
    // }

    // res.json(dbUser2)

    // Create a new object, with the properties of dbUser plus isCurrentUser and isFollowing
    let dbUser3 = {...dbUser.get({plain: true}), isCurrentUser, isFollowing};
    res.json(dbUser3)
  }).catch(err => res.send(err))
})

// Route to update or add user profile details.
router.post('/profile', upload.single('profilepicture'), function(req, res) {
  // console.log('In post /api/users/profile')
  console.log('Req.Body', JSON.stringify(req.body))
  console.log('Req.Body', req.body)
  console.log('Req.File', req.file)

  const { name, bio } = req.body;

  if (req.file) {
    // Convert req.file from a buffer to a dataURI
    datauri.format(path.extname(req.file.originalname), req.file.buffer);
    const file = datauri.content;

    console.log('file', file)
  
    // Upload the file with Cloudinary
    uploader.upload(file)
      .then(image => {
        // Need to save the image info into the database, 
        // then associate the URL with the user for their profile picture. 
        const picture = JSON.stringify({id: image.public_id, url: image.url});
        
        // Find the logged-in user, then update the fields.
        db.User.update({ name, bio, picture }, { where: { id: req.user.id } })
          .then(dbUser => {
            res.sendStatus(200);
          }).catch(err => res.json(err))

        // res.json({ data: { image } })
      }).catch(err => {
        res.json(err)
      })

  }
  else {
    // Find the logged-in user, then update the fields.
    db.User.update({ name, bio }, { where: { id: req.user.id } })
    .then(dbUser => {
      res.sendStatus(200);
    }).catch(err => res.json(err))

    // res.json('No file was attached')
  }
  
})

// Route to follow another user. Provide the username of the user to follow.
router.post('/follow', function(req, res) {
  const { username } = req.body;

  db.User.findOne({where: {username}}).then(dbUser => {
    if (!dbUser) {throw(`No user named ${username} was found`)}

    console.log("in /api/users/follow dbUser:", dbUser)
    console.log("in /api/users/follow req.user:", req.user)

    const FollowerId = req.user.id;
    const FollowedId = dbUser.id;

    const FollowEntry = {
      FollowerId,
      FollowedId,
    };

    console.log("FollowEntry", FollowEntry)
    // console.log('db', db)

    // // Make sure this person isn't already following.
    // db.Follow.findOne({where: FollowEntry}).then(dbFollower => {
    //   console.log('dbFollower', dbFollower)

    //   if (dbFollower) {
    //     throw(`User ${FollowerId} is already following User ${FollowedId}`);
    //   }
    //   // Make sure this user isn't trying to follow themselves.
    //   else if (FollowerId === FollowedId) {
    //     throw("A user can't follow themselves.")
    //   }
    //   else {
    //     db.Follow.create(FollowEntry).then(data =>
    //       res.json(data)
    //     )
    //   }
    // }).catch(err => res.send(err))

    // To make the logged-in user follow another user, we must look up the logged-in user,
    // which we will call 'follower', then do followed.addFollower(follower) to make the association.
    const followed = dbUser;
    db.User.findOne({where: {id: req.user.id}}).then(follower => {
      followed.addFollower(follower).then(data => res.json(data)).catch(err => res.send(err))
    })
    
  }).catch(err => res.send(err))
})

router.delete('/follow', function(req, res) {
  const { username } = req.body;
  db.User.findOne({where: {username}}).then(dbUser => {
    if (!dbUser) {throw(`No user named ${username} was found`)}

    const followed = dbUser;
    db.User.findOne({where: {id: req.user.id}}).then(follower => {
      followed.removeFollower(follower).then(data => res.json(data)).catch(err => res.send(err))
    })

  }).catch(err => res.send(err))
})

module.exports = router;