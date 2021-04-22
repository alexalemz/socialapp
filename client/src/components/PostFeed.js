import React, { Component } from 'react'
import API from '../utils/API'
import Post from './Post'

class PostFeed extends Component {
  state = {
    posts: [],
    postsReceived: false, // This functions the same as the 'loaded' property in other components.
  }

  componentDidMount() {
    this.loadPosts();
  }

  // This is necessary for when the username changes in the route
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      console.log("In PostFeed. Got some new props", prevProps.match.params.username, this.props.match.params.username)
      this.loadPosts();
    }
  }

  loadPosts = () => {
    this.setState({postsReceived: false}, () => {

      const { username } = this.props.match.params; //this.props
      console.log('In PostFeed. Username', username)
      API.getPosts({username: username}).then(res => {
        console.log("PostFeed", res)
        this.setState({
          posts: res.data,
          postsReceived: true,
        })
      })
      
    })
  }

  render() {
    const { posts, postsReceived } = this.state;
    return (
      <div>
        <h2 style={{ textAlign:"center", fontSize:"24px" }}>Posts</h2>
        {posts.length && 
          posts.map(post => {
            return (<Post key={post.id} post={post} />)
        }) || <p>{ postsReceived ? "This user has no posts." : "Fetching posts..." }</p>}
      </div>
    )
  }
}

export default PostFeed