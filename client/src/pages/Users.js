import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/UserCard';
import API from '../utils/API';

export default class Users extends Component {
  state = {
    users: []
  }

  componentDidMount() {
    console.log("This.state.users", this.state.users)
    API.getUsers().then(res => {
      this.setState({
        users: res.data
      })
    })
  }

  render() {
    console.log("This.state.users", this.state.users)
    return (
      <div className="container">
        Users
        {this.state.users.length && 
          this.state.users.map(user => (
            <UserCard key={`user${user.id}`} user={user} />
            // <p><Link to={`/users/${user.username}`}>@{user.username}</Link></p>
        )) || <p>Fetching users...</p>}
      </div>
    )
  }
}