import React, { Component } from 'react';

import CreatePost from '../components/CreatePost'
import HomeFeed from '../components/HomeFeed'

import API from '../utils/API';

export default class Home extends Component {
  state = {
    username: '',
    followers: [],
    followeds: [],
    name: '',
    pictureUrl: '',
    // isFollowing: undefined,
    // isCurrentUser: undefined,
  }

  componentDidMount() {
    API.getUserProfile().then(res => {
      console.log('Home page', res.data)
      const { username, Followers: followers, Followeds: followeds, name, picture } = res.data;
      let pictureUrl = picture ? JSON.parse(picture).url : null;

      this.setState({
        username, followers, followeds, name, pictureUrl,
      })
    })

  }

  render() {
    const { username, followers, followeds, name, pictureUrl } = this.state;

    return (
      <div className="container">
        Home
        <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <img src={pictureUrl} style={{width: 100, height: 100, borderRadius: '10%'}} />
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
          <div className="col-sm-6 bg-white home-center-column">
            <CreatePost />
            <HomeFeed />
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    )
  }
}