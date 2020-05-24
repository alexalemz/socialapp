module.exports = function(sequelize, DataTypes) {
  var Push_Subscription = sequelize.define("Push_Subscription", {
    subscription: DataTypes.TEXT,
  });

  Push_Subscription.associate = function(models) {
    Push_Subscription.belongsTo(models.User, {});
  }

  return Push_Subscription;
}