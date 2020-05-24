module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    content: DataTypes.STRING,
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {});
    Comment.belongsTo(models.Post, {});
    // Comment.belongsToMany(models.User, {as: "Likers", through: "LikedComments", /* foreignKey: "userId" */})
  }

  Comment.hook("afterCreate", function(comment) {
    console.log("\n\nComment After Create started")
    // Figure out how to retrieve the user and post information from within comment.
    comment.getUser().then(user => {
      comment.getPost().then(post => {
        sequelize.models.Notification.create({
          description: `${user.name} commented on your post: "${comment.content}"`,
          UserId: post.UserId,
        }).then(dbNotification => console.log("created a notification!"))
      })
    })

  })

  return Comment;
}