import React, { Component } from 'react'
import API from '../utils/API'
import Post from './Post'

class PostFeed extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    const { username } = this.props.match.params //this.props
    console.log('In PostFeed. Username', username)
    API.getPosts({username: username}).then(res => {
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