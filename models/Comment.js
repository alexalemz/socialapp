module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    content: DataTypes.STRING,
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {});
    Comment.belongsTo(models.Post, {});
    // Comment.belongsToMany(models.User, {as: "Likers", through: "LikedComments", /* foreignKey: "userId" */})
  }

  return Comment;
}