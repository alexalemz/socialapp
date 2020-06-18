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
    postCount: '',
    // isFollowing: undefined,
    // isCurrentUser: undefined,
  }

  componentDidMount() {
    API.getUserProfile().then(res => {
      console.log('Home page', res.data)
      const { username, Followers: followers, Followeds: followeds, name, picture, postCount } = res.data;
      let pictureUrl = picture ? JSON.parse(picture).url : null;

      this.setState({
        username, followers, followeds, name, pictureUrl, postCount
      })
    })

  }

  render() {
    const { username, followers, followeds, name, pictureUrl, postCount } = this.state;

    if (username)
    return (
      <div className="container">
        Home
        <div className="row">
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <div className="row">
                    <div className="col-4">
                      <div
                        style={{
                          width: 100, height: 100, 
                          borderRadius: '10%',
                          backgroundImage: `url("${pictureUrl}")`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }} 
                      />
                    </div>
                    <div className="col-7">
                      {/* Align the text to the bottom of the div */}
                      <p style={{position: 'absolute', bottom: 0, /* left: 0, */ margin: 0, padding: 0}}><span style={{fontSize: "1.2rem"}}><strong>{name}</strong></span>
                      <br/><span  style={{color: "gray"}}>@{username}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row no-gutters" style={{color: "gray", fontSize: ".8rem", fontWeight: "bold"}}>
                  <div className="col-4">
                    Posts <br/>
                    <a href={`users/${username}`} className="home-stats-number">{postCount}</a>
                  </div>
                  <div className="col-4">
                    Followers <br/>
                    <a href={`users/${username}/followers`} className="home-stats-number">{followers.length}</a>
                  </div>
                  <div className="col-4">
                    Following <br/>
                    <a href={`users/${username}/following`} className="home-stats-number">{followeds.length}</a>
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
    else
      return (
        <div className="container">
          <h2>Welcome to Social App!</h2>
          <p>You can check out the latest posts from our users.
            <a className="btn btn-primary mx-3" href="/users">View all users</a>
          </p>
          <p></p>
          <p>Sign in to start posting.
            <a className="btn btn-secondary mx-3" href="/login">Sign in</a>
          </p>
        </div>
      )
  }
}