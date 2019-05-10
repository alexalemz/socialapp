module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    content: DataTypes.STRING,
    // photo: DataTypes.STRING
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, {});
    Post.hasMany(models.Comment, {});
    Post.belongsToMany(models.User, {as: "Likers", through: "PostLikes", /* foreignKey: "LikedId", otherKey: "LikerId" */});
  }

  return Post;
}