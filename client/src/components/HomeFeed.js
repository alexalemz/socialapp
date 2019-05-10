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
        <h5>Feed</h5>
        {this.state.posts.length && 
          this.state.posts.map(post => {
            return (<Post post={post} />)
        }) || <p>Fetching posts...</p>}
      </div>
    )
  }
}

export default HomeFeed