// const Post = require("./post");

var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Display Name (Full name)
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    // Bio/description
    bio: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    // Profile pic (url)
    picture: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    // Website link
  });

  User.associate = function(models) {
    User.hasMany(models.Post, {});
    User.hasMany(models.Comment, {});
    User.hasMany(models.Push_Subscription, {});
    // User.belongsToMany(models.User, {as: "Followed", through: "Followers", /* foreignKey: "userId" */})
    User.belongsToMany(models.User, {as: "Followeds", through: "Follows", foreignKey: "FollowerId", otherKey: "FollowedId"});
    User.belongsToMany(models.User, {as: "Followers", through: "Follows", foreignKey: "FollowedId", otherKey: "FollowerId"});

    User.belongsToMany(models.Post, {as: "LikedPosts", through: "PostLikes", /* foreignKey: "LikerId", otherKey: "LikedId" */});
  }

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(11), null);
  });

  return User;
}