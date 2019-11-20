import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/UserCard';
import API from '../utils/API';

export default class Users extends Component {
  state = {
    username: '',
    name: '',
    followType: '',
    followers: [],
    followeds: [],
    // followType: undefined,
  }

  componentDidMount() {
    // console.log("This.state.users", this.state.users)
    // API.getUsers().then(res => {
    //   this.setState({
    //     users: res.data
    //   })
    // })
    this.loadProfile();
  }

  loadProfile = () => {
    console.log('UserFollows', this.props.match)
    const { params: {username}, path } = this.props.match;
    const followType = path.includes('following') ? 'following' : 'followers';
    console.log('FollowType and username', followType, username)

    API.getUserProfile({username}).then(res => {
      const {Followers, Followeds, name} = res.data;

      this.setState({
        // users: followType === 'followers' ? Followers : Followeds,
        username,
        name,
        followType,
        followers: Followers,
        followeds: Followeds,
      })
    })
  }

  render() {
    const { username, name, /* followType,  */followers, followeds } = this.state;
    const followType = this.props.match.path.includes('following') ? 'following' : 'followers';

    // const users = (followType === 'followers') ? followers : followeds;
    let users = [];

    const followersHeading = {};
    const followingHeading = {};

    if (followType === 'followers') {
      users = followers;
      followersHeading.fontWeight = 'bold';
      followingHeading.fontWeight = '';
    }
    else if (followType === 'following') {
      users = followeds;
      followersHeading.fontWeight = '';
      followingHeading.fontWeight = 'bold';
    }

    // There should be the user's username at the top, then two columns below.
    // The top of the first column says # followers, and second says # following.
    // When you click on one, the part underneath will display the appropriate list,
    // and the heading will be in bold.
    return (
      <div className='container text-center'>
        {/* <h5>{username ? username + (followType === 'followers' ? `'s followers` : ` is following`) : ''}</h5> */}
        <h5>{name ? (
          <>
            <strong>{name}</strong>{followType === 'followers' ? `'s followers` : ` is following`}
          </>) : ''}
        </h5>
        {/* <h5>{username}</h5>
        <div className='row text-center'>
          <div className='col-6' onClick={() => {
            // this.setState({followType: 'followers'});
          }}>
            <a href={`/users/${username}/followers`}><span style={followersHeading}>{followers.length} followers</span></a>
          </div>
          <div className='col-6' onClick={() => {
            // this.setState({followType: 'following'});
          }}>
            <a href={`/users/${username}/following`}><span style={followingHeading}>{followeds.length} following</span></a>
          </div>
        </div> */}
        <div className='row'>
          <div className='col-12'>
            {users.length && 
              users.map(user => (
                <UserCard user={user} />
                // <p><Link to={`/users/${user.username}`}>@{user.username}</Link></p>
              )) || ' '}
          </div>
        </div>
      </div>
    )
  }
}