import React, { Component } from 'react';

import CreatePost from '../components/CreatePost'
import HomeFeed from '../components/HomeFeed'

import API from '../utils/API';

export default class Home extends Component {
  state = {
    username: '',
    followers: [],
    followeds: [],
    // isFollowing: undefined,
    // isCurrentUser: undefined,
  }

  componentDidMount() {
    API.getUserProfile().then(res => {
      console.log('Home page', res.data)
      const { username, Followers: followers, Followeds: followeds } = res.data;

      this.setState({
        username, followers, followeds
      })
    })

  }

  render() {
    const { username, followers, followeds } = this.state;

    return (
      <div className="container">
        Home
        <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  @{username}
                </div>
                <div className="row">
                  <div className="col-6">
                    Followers <br/>
                    {followers.length}
                  </div>
                  <div className="col-6">
                    Following <br/>
                    {followeds.length}
                  </div>
                  {/* <div className="col-4">
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 bg-white">
            <CreatePost />
            <HomeFeed />
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    )
  }
}