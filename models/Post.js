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

  Post.hook("afterCreate", function(post) {
    // Create notifications for everyone who prefers to get notifications whenever this user posts.
    post.getUser().then(user => {
      // sequelize.models.Follow.findAll({ where: { FollowedId: post.UserId } })
      // .then(follows => {
      //   console.log("\n\nPost.afterCreate. these are the followers of the post author:", follows)
      //   const followerIds = follows.map(follow => follow.FollowerId);
      user.getFollowers().then(followers => {
        console.log("\n\nPost.afterCreate. these are the followers of the post author:", followers)
        const followerIds = followers.map(follower => follower.id);
        console.log("\n\nthese are the followerIds", followerIds);
        sequelize.models.Notification_Preference.findAll({
          where: {
            UserId: followerIds,
            notification_type: 'new_post',
            enabled: true,
          },
          raw: true,
        }).then(nps => {
          const records = nps.map(np => ({
            UserId: np.UserId,
            description: `${user.name} just posted: "${post.content}"`,
          }))
          sequelize.models.Notification.bulkCreate(records).then(dbNotifications => console.log("created notifications!"))
        })
      })

    })
  })

  return Post;
}