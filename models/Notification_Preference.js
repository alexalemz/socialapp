module.exports = function(sequelize, DataTypes) {
  var Notification_Preference = sequelize.define("Notification_Preference", {
    notification_type: DataTypes.ENUM('new_follower', 'new_comment', 'new_post', 'new_like'),
    FollowedId: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN,
  });

  Notification_Preference.associate = function(models) {
    Notification_Preference.belongsTo(models.User, {});
  }

  return Notification_Preference;
}