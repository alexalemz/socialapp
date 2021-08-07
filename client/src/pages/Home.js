import React, { Component } from 'react';

import CreatePost from '../components/CreatePost'
import HomeFeed from '../components/HomeFeed'
import Post from '../components/Post'

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
    recentPosts: [],

    // This property 'loaded' will tell us whether the API call has been made and data has been retrieved.
    // I wanted this so that I can figure out whether to render the page for a logged-in user or a guest.
    // This can only be done once the data has come back. I don't want the guest view to render by default then be replaced a second later once the data comes back.
    loaded: false,
    recentPostsLoaded: false,
  }

  componentDidMount() {
    API.getUserProfile().then(res => {
      console.log('Home page', res.data)
      const { username, Followers: followers, Followeds: followeds, name, picture, postCount } = res.data;
      let pictureUrl = picture ? JSON.parse(picture).url : null;

      this.setState({
        username, followers, followeds, name, pictureUrl, postCount, "loaded": true
      })
    }).catch(err => {
      console.log('Home page getUserProfile() fetch error', err)
      this.setState({ "loaded": true })
    })

    API.getPosts({limit: 5}).then(res2 => {
      const recentPosts = res2.data;
      console.log('RecentPosts in componentDidMount', recentPosts)
      this.setState({ recentPosts, recentPostsLoaded: true })
    })
  }

  render() {
    const { 
      username, followers, followeds, name, pictureUrl, postCount, loaded, 
      recentPosts, recentPostsLoaded 
      } = this.state;
    console.log ('Recent Posts', recentPosts)

    if (username && loaded)
    return (
      <div className="container">
        {/* Home */}
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
    else if (!username && loaded)
      return (
        <div className="container" id="home-container" style={{
          margin: '50px auto',
          textAlign: 'center',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '40px 0 20px',
          maxWidth: '900px'
        }}>
          <h2 className="mb-5" id="home-greeting">Welcome to Social App!</h2>
          {/* <p>You can check out the latest posts from our users.
            <a className="btn btn-primary ml-3" href="/users">View all users</a>
          </p>
          <p>Sign in to start posting.
            <a className="btn btn-secondary ml-3" href="/login">Sign in</a>
          </p> */}

          {/* Here, I've put the buttons and their descriptions in columns. */}
          <div className="row">
            <div className="col-sm-6">
              <p style={{color: '#444'}}>See who's using this app.{/* Who is using this app? */} {/* Check out the latest posts from our users. */}</p>
              <p><a className="btn btn-primary mb-4" href="/users">View all users</a></p>
            </div>
            <div className="col-sm-6">
              <p style={{color: '#444'}}>Sign in to start posting.</p>
              <p><a className="btn btn-secondary" href="/login">Sign in</a></p>
            </div>
          </div>
          {/* This is the original layout. */}
          <div style={{display:'none'}}>
          <p style={{color: '#444'}}>See who's using this app.{/* Who is using this app? */} {/* Check out the latest posts from our users. */}</p>
          <p><a className="btn btn-primary mb-4" href="/users">View all users</a></p>
          <p style={{color: '#444'}}>Sign in to start posting.</p>
          <p><a className="btn btn-secondary" href="/login">Sign in</a></p>
          </div>

          <div id="recentPosts" className="text-left" style={{width: '90%', margin: '0 auto'}}>
            {recentPostsLoaded && recentPosts.length > 0 && (
              <>
                <p style={{color: '#444', fontSize: '1.5em'}} className="text-center mt-4">Latest Posts</p>
                {recentPosts.map(post => (
                  // <p>{recentPost.content}</p>
                  <Post key={post.id} post={post} />
                ))}
              </>
            )}
          </div>
        </div>
      )
    else return <div className="container" />
  }
}