module.exports = function(sequelize, DataTypes) {
  var Follow = sequelize.define("Follow", {
    FollowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FollowedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Follow;
}