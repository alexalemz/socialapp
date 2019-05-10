import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PostFeed from '../components/PostFeed';
import FollowButton from '../components/FollowButton';
import API from '../utils/API';

export default class Home extends Component {
  state = {
    username: this.props.match.params.username,
    followers: [],
    followeds: [],
    isFollowing: undefined,
    isCurrentUser: undefined,
  }
  
  componentDidMount() {
    this.loadProfile();
  }

  loadProfile = () => {
    const { username } = this.props.match.params;

    API.getUserProfile({username}).then(res => {
      console.log('UserProfile', res.data)
      const { username, email, Followers, Followeds, isFollowing, isCurrentUser } = res.data;
      this.setState({
        followers: Followers,
        followeds: Followeds,
        isFollowing,
        isCurrentUser,
      })
    })
  }

  handleFollow = () => {
    // Do a request to follow the user, then update isFollowing to true if successful.
    API.follow({username: this.state.username}).then(res => {
      // this.setState({isFollowing: true});
      this.loadProfile();
    })
  }

  handleUnfollow = () => {
    if (!window.confirm('Are you sure you want to unfollow this user?')) return

    // Do a request to unfollow the user, then update isFollowing to false if successful.
    API.unfollow({username: this.state.username}).then(res => {
      // this.setState({isFollowing: false});
      this.loadProfile();
    })
  }
  
  render() {
    const { username, email, followers, followeds, isFollowing, isCurrentUser } = this.state;
    return (
      <div className="container">
        <div className="row">
          <span className="mx-auto">
            <h5>{`${username}'s profile`}</h5>
          </span>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <Link to={`/users/${username}/followers`}>{followers.length} followers</Link> <br/>
            <Link to={`/users/${username}/following`}>{followeds.length} following</Link>
          </div>
          <div className="col-sm-6 bg-white">
            <PostFeed username={username} />
          </div>
          <div className="col-sm-3">
            {/* <FollowButton isFollowing={isFollowing} isCurrentUser={isCurrentUser} /> */}
            <FollowButton {...{isFollowing, isCurrentUser}} handleFollow={this.handleFollow} handleUnfollow={this.handleUnfollow} />
          </div>
        </div>
      </div>
    )
  }
}

