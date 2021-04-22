import React, { Component } from 'react'
import API from '../utils/API'
import Post from './Post'

class HomeFeed extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    API.getHomeFeed().then(res => {
      console.log("HomeFeed", res)
      this.setState({
        posts: res.data
      })
    })
  }

  render() {
    return (
      <div>
        {/* <h2 style={{ textAlign:"center", fontSize:"24px" }}>Feed</h2> */}
        <h5 style={{textAlign: 'center'}}>Feed</h5>
        {this.state.posts.length && 
          this.state.posts.map(post => {
            return (<Post key={post.id} post={post} />)
        }) || <p>Fetching posts...</p>}
      </div>
    )
  }
}

export default HomeFeed