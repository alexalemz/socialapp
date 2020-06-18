import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, NavLink } from 'react-router-dom';

import UserFollows from './UserFollows';
import PostFeed from '../components/PostFeed';
import FollowButton from '../components/FollowButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import API from '../utils/API';

export default class Home extends Component {
  state = {
    username: this.props.match.params.username,
    name: undefined,
    followers: [],
    followeds: [],
    isFollowing: undefined,
    isCurrentUser: undefined,
    bio: undefined,
    picture: undefined,
    postCount: undefined,
  }
  
  componentDidMount() {
    this.loadProfile();
  }

  // Whenever the username in the url changes, we need to load the appropriate user info.
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      console.log("Got some new props", prevProps.match.params.username, this.props.match.params.username)
      this.loadProfile();
    }
  }

  loadProfile = () => {
    const { username } = this.props.match.params;

    API.getUserProfile({username}).then(res => {
      console.log('UserProfile', res.data)
      const { username, name, email, Followers, Followeds, isFollowing, isCurrentUser, bio, postCount } = res.data;
      let picture = res.data.picture && JSON.parse(res.data.picture).url;
      
      this.setState({
        username,
        name,
        followers: Followers || [],
        followeds: Followeds || [],
        isFollowing,
        isCurrentUser,
        bio,
        picture,
        postCount,
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
    const { username, name, email, followers, followeds, isFollowing, isCurrentUser, picture, bio, postCount } = this.state;
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
          <div className="col-sm-5 offset-sm-3">
            <ul className="nav nav-tabs text-center d-none d-md-flex">
              <li className="nav-item">
                <NavLink exact to={`${userPath}`} className="nav-link"><span className="profile-tab-label">Posts</span><br/><span className="profile-tab-number">{postCount}</span></NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to={`${userPath}/followers`} className="nav-link"><span className="profile-tab-label">Followers</span><br/><span className="profile-tab-number">{followers.length}</span></NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to={`${userPath}/following`} className="nav-link"><span className="profile-tab-label">Following</span><br/><span className="profile-tab-number">{followeds.length}</span></NavLink>
              </li>
            </ul>
          </div>

          {/* If a user is on their own profile page, have a link to Edit Profile */}
          {isCurrentUser && <Link className="btn btn-outline-secondary edit-profile-button" to="/editprofile">Edit profile</Link>}
          {/* <FollowButton isFollowing={isFollowing} isCurrentUser={isCurrentUser} /> */}
          <FollowButton {...{isFollowing, isCurrentUser}} handleFollow={this.handleFollow} handleUnfollow={this.handleUnfollow} />
        </div>
        <div className="row">
          <div className="col-sm-3 profile-left-column">
            {/* Profile info (including bio, joined date, website...) */}
            <div className="profile-info-container">
              {picture && 
                <div 
                  // style={{maxWidth: '75%', maxHeight: '75%', borderRadius: '10%'}} 
                  className="profile-picture"
                  style={{
                    backgroundImage: `url("${picture}")`, 
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />}
              <h4 className="profile-name">{name}</h4>
              {/* On Mobile, username link's to profile page, so user can see posts instead of followers */}
              <p className="profile-username d-none d-md-block">{`@${username}`}</p>
              <Link to={`/users/${username}`}><p className="profile-username d-block d-md-none">{`@${username}`}</p></Link>
              {bio && <p className='profile-bio'>{`${bio}`}</p> }
              <div className="profile-followers-stats d-md-none">
                <Row noGutters>
                  <Col xs={5}>
                    <Link to={`/users/${username}/followers`}>
                      <span className="profile-stats-number">{followers.length}</span>
                      <span className="profile-stats-label"> Followers</span>
                    </Link> <br/>
                  </Col>
                  <Col xs={5}>
                    <Link to={`/users/${username}/following`}>
                      <span className="profile-stats-number">{followeds.length}</span>
                      <span className="profile-stats-label"> Following</span>
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="col-sm-6 bg-white profile-center-column">
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

