import React, { Component } from 'react'
import API from '../utils/API'
import Post from './Post'

class PostFeed extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    console.log('In PostFeed. Username', this.props.username)
    API.getPosts({username: this.props.username}).then(res => {
      console.log("PostFeed", res)
      this.setState({
        posts: res.data
      })
    })
  }

  render() {
    return (
      <div>
        <h5>Posts</h5>
        {this.state.posts.length && 
          this.state.posts.map(post => {
            return (<Post post={post} />)
        }) || <p>Fetching posts...</p>}
      </div>
    )
  }
}

export default PostFeed