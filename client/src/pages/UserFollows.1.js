import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/API';

export default class Users extends Component {
  state = {
    username: '',
    followType: '',
    users: [],
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
      const {Followers, Followeds} = res.data;

      this.setState({
        users: followType === 'followers' ? Followers : Followeds,
        username,
        followType,
      })
    })
  }

  render() {
    const { username, followType, users } = this.state;
    return (
      <div>
        <h5>{followType === 'followers' ? `${username}'s followers` : `${username} is following`}</h5>
        {users.length && 
          users.map(user => (
            <p><Link to={`/users/${user.username}`}>@{user.username}</Link></p>
        )) || <p>Fetching users...</p>}
      </div>
    )
  }
}