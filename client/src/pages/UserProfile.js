import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, NavLink } from 'react-router-dom';

import UserFollows from './UserFollows';
import PostFeed from '../components/PostFeed';
import FollowButton from '../components/FollowButton';
import API from '../utils/API';

export default class Home extends Component {
  state = {
    username: this.props.match.params.username,
    name: undefined,
    followers: [],
    followeds: [],
    isFollowing: undefined,
    isCurrentUser: undefined,
  }
  
  componentDidMount() {
    this.loadProfile();
  }

  // Whenever the username in the url changes, we need to load the appropriate user info.
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      console.log("Got some new props")
      this.loadProfile();
    }
  }

  loadProfile = () => {
    const { username } = this.props.match.params;

    API.getUserProfile({username}).then(res => {
      console.log('UserProfile', res.data)
      const { username, name, email, Followers, Followeds, isFollowing, isCurrentUser } = res.data;
      this.setState({
        username,
        name,
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
    const { username, name, email, followers, followeds, isFollowing, isCurrentUser } = this.state;
    const userPath = `/users/${username}`;
      
    return (
      <div className="container-fluid">
        <div className="row">
          <span className="mx-auto">
            {/* <h5>{`${username}'s profile`}</h5> */}
          </span>
        </div>
        <div className="row mb-3 bg-white shadow-sm">
          {/* Posts/Following/Followers/Likes tabs + FollowButton */}
          <div className="col-sm-6 offset-sm-3">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <NavLink exact to={`${userPath}`} className="nav-link">Posts</NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to={`${userPath}/followers`} className="nav-link">{followers.length} followers</NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to={`${userPath}/following`} className="nav-link">{followeds.length} following</NavLink>
              </li>
            </ul>
          </div>

          {/* If a user is on their own profile page, have a link to Edit Profile */}
          {isCurrentUser && <Link className="btn btn-outline-primary" to="/editprofile">Edit profile</Link>}
          {/* <FollowButton isFollowing={isFollowing} isCurrentUser={isCurrentUser} /> */}
          <FollowButton {...{isFollowing, isCurrentUser}} handleFollow={this.handleFollow} handleUnfollow={this.handleUnfollow} />
        </div>
        <div className="row">
          <div className="col-sm-3">
            {/* Profile info (including bio, joined date, website...) */}
            <h5>{name}</h5>
            <p>{`@${username}`}</p>
            {/* 
              <Link to={`/users/${username}/followers`}>{followers.length} followers</Link> <br/>
              <Link to={`/users/${username}/following`}>{followeds.length} following</Link>
             */}
          </div>
          <div className="col-sm-6 bg-white">
            <Switch>
              <Route exact path="/users/:username" render={props => <PostFeed {...props} /* username={username} */  />} />
              <Route exact path="/users/:username/followers" component={UserFollows} />
              <Route exact path="/users/:username/following" component={UserFollows} />
            </Switch>
            {/* Post feed */}
            {/* <PostFeed username={username} /> */}
          </div>
          <div className="col-sm-3">
            {/* Suggested users? */}
          </div>
        </div>
      </div>
    )
  }
}

