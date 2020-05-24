const { sendNotification, payloadGenerator } = require('../config/pushNotifications');

module.exports = function(sequelize, DataTypes) {
  var Notification = sequelize.define("Notification", {
    description: DataTypes.STRING,
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    // type: DataTypes.ENUM('new_follower', 'new_comment', 'new_like', 'new_post')
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {});
  }

  Notification.hook("afterCreate", sendOutNotification)
  Notification.hook("afterBulkCreate", sendOutNotification)

  function sendOutNotification(notification) {
    sequelize.models.Push_Subscription.findAll({
      where: {
        UserId: notification.UserId,
      }
    }).then(pushSubscriptions => {
      const payload = payloadGenerator(notification.description);
      for (ps of pushSubscriptions) {
        const subscription = JSON.parse(ps.subscription)
        sendNotification(subscription, payload).then(result => {
          console.log("\n\nSent notification, result:", result)
        })
      }
    })
  }
  
  return Notification;
}
