import React, { Component } from 'react';
import { Input } from '../components/Form';
import API from '../utils/API';
import { AccountConsumer } from '../providers/AccountProvider';

export default class Login extends Component {
  state = {
    login: true, // Determine whether the user is logging in or registering.
    email: "",
    username: "",
    password: "",
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleFormSubmit = (updateAccount, event) => {
    event.preventDefault();
    console.log("event", event)
    console.log("updateAccount", updateAccount)

    // Do a post to '/api/login/'
    let { email, username, password } = this.state;
    // Trim the email and username
    email = email.trim();
    username = username.trim();

    if (this.state.login) {
      API.login({email, password}).then(res => {
        console.log("Login successful?")
        API.user_data().then(res => {
          const userInfo = res.data;
          updateAccount(userInfo)
          console.log(userInfo);
          this.props.history.push('/')
        })
      })
    }
    else {
      API.register({email, username, password}).then(res => {
        console.log("Registration successful?")
        API.user_data().then(res => {
          const userInfo = res.data;
          updateAccount(userInfo)
          console.log(userInfo);
          this.props.history.push('/editprofile')
        })
      })
    }
  }

  render() {
    return (
      <AccountConsumer>
        {({updateAccount}) => (
          <div className="container">
            {/* Login */}
            <form onChange={this.handleInputChange} onSubmit={(event) => this.handleFormSubmit(updateAccount, event)}>
              <Input value={this.state.email} name="email" type="email" id="email" label="Email address" placeholder="name@example.com" />
              {!this.state.login && <Input value={this.state.username} name="username" type="text" id="username" label="Username" placeholder="username" />}
              <Input value={this.state.password} name="password" type="password" id="password" label="Password" />
              <button type="submit" class="btn btn-primary mb-2">{this.state.login ? "Sign in" : "Create Account"}</button>
            </form>
            <button className="btn btn-secondary" onClick={(event) => {this.setState({login: !this.state.login})}}>{this.state.login ? "Need to create an account?" : "Already have an account?"}</button> <br/>
          </div>
        )}
      </AccountConsumer>
    )
  }
}