import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/UserCard';
import API from '../utils/API';

export default class Users extends Component {
  state = {
    users: [],
    loaded: false,
  }

  componentDidMount() {
    console.log("This.state.users", this.state.users)
    API.getUsers().then(res => {
      this.setState({
        users: res.data,
        loaded: 'true'
      })
    })
  }

  render() {
    const { users, loaded } = this.state;
    console.log("This.state.users", users)
    return (
      <div className="container">
        <h2 style={{fontSize:"20px", margin:"10px 0"}}>Users</h2>
        {users.length !== 0 &&
          users.map(user => (
            <UserCard key={`user${user.id}`} user={user} />
            // <p><Link to={`/users/${user.username}`}>@{user.username}</Link></p>
        )) || <p>{loaded ? 'There are currently no users' : 'Fetching users...'}</p>}
      </div>
    )
  }
}