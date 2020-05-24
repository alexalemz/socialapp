var db = require("../models");
var express = require('express');
var router = express.Router();
const webpush = require("web-push");
webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT, 
  process.env.PUBLIC_VAPID_KEY, 
  process.env.PRIVATE_VAPID_KEY
);

router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  const UserId = req.user ? req.user.id : undefined;
  const stringifiedSubscription = JSON.stringify(subscription);

  console.log("This is the subscription:", subscription)

  // Save the subscription only if it's not already in the database.
  db.Push_Subscription.findOrCreate({
    where: {
      subscription: stringifiedSubscription,
      UserId,
    },
    defaults: {
      subscription: stringifiedSubscription,
      UserId,
    }
  }).then(([dbPushSubscription, created]) => {
    const payload = JSON.stringify({
      title: 'Hello!',
      body: 'It works.',
    })
  
    webpush.sendNotification(subscription, payload)
      .then(result => console.log(result))
      .catch(e => console.log(e.stack))
  
    res.status(200).json({'success': true})
  }).catch(err => {
    console.log(err)
    res.status(400).json({'success': false})
  })

});

router.post('/unsubscribe', (req, res) => {
  const subscription = req.body;
  const stringifiedSubscription = JSON.stringify(subscription);

  console.log("This is the subscription:", subscription)

  // Save the subscription only if it's not already in the database.
  db.Push_Subscription.destroy({
    where: {
      subscription: stringifiedSubscription,
      UserId: req.user.id,
    }
  }).then(dbPushSubscription => {
    res.status(200).json({'success': true})
  }).catch(err => {
    console.log(err)
    res.status(400).json({'success': false})
  })
})

// Check whether the logged-in user has a subscription with this device.
// Pass in the subscription.
router.post('/subscriptionStatus', (req, res) => {
  const subscription = req.body;
  const stringifiedSubscription = JSON.stringify(subscription);

  db.Push_Subscription.find({
    where: {
      UserId: req.user.id,
      subscription: stringifiedSubscription,
    }
  }).then(subscriptionExists => {
    res.json(!!subscriptionExists);
  })
})

router.post('/test', (req, res) => {
  const subscription = req.body;
  console.log("in notifications/test -- this is the body", subscription)

  const payload = JSON.stringify({
    title: 'Testing',
    body: 'It works.',
  })

  webpush.sendNotification(subscription, payload)
    .then(result => console.log(result))
    .catch(e => console.log(e.stack))

  res.status(200).json({'success': true})
})

// Will return the logged-in user's notification preferences
router.get('/preferences', (req, res) => {
  const UserId = req.user && req.user.id;
  console.log("\n\n\nin notifications/preferences. UserId", UserId)
  db.Notification_Preference.findAll({
    where: { UserId }
  }).then(notification_preferences => {
    const np = notification_preferences.map(record => record.get({ plain: true }))
    res.json(np);
  })
})

// Update the user's notification preferences here.
// This will create a record if it doesn't exist, or just update it.
router.post('/preferences', (req, res) => {
  const UserId = req.user && req.user.id;
  const { notification_type, FollowedId, enabled } = req.body;
  const updated = { enabled };
  if (FollowedId) updated.FollowedId = FollowedId;

  db.Notification_Preference.findOne({
    where: { 
      UserId, 
      notification_type, 
    }
  }).then(np => {
    // If found, then update.
    if (np) {
      db.Notification_Preference.update(updated, { where: { UserId, notification_type } })
    }
    // If not, create.
    else {
      db.Notification_Preference.create({
        UserId,
        notification_type,
        FollowedId,
        enabled,
      })
    }
    res.send(`Updated or created notification preference of type ${notification_type}`)
  })
})

module.exports = router;
