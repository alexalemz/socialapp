import React, { Component } from 'react'
import { Link } from 'react-router-dom'
const moment = require('moment')

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: ''
    }
  }

  updateTimestamp = () => {
    const {post: {createdAt}} = this.props;
    const momentCreated = moment(createdAt);
    // If the post is more than a day old (at least 21 hours), use the date as the timestamp, otherwise say how long ago it was posted.
    const hourDiff =  moment().diff(momentCreated, 'hour');
    const timestamp = hourDiff > 21 ? momentCreated.format('MMM D YYYY') : momentCreated.fromNow(0)
    this.setState({timestamp})
  }

  componentDidMount() {
    this.updateTimestamp();

    this.timerID = setInterval(
      () => this.updateTimestamp(),
      1000 * 60
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const { post, post: {User, content, Comments} } = this.props;
    console.log("In Post.js User:", User)
    const pictureUrl = User.picture ? JSON.parse(User.picture).url : null;
    return (
      <div className="post-container" style={{
        border: 'solid black 1px',
        borderRadius: '15px',
        padding: '10px',
        margin: '10px 0',
      }}>
        <div className="post-user-img-container">
          <img className="post-user-img" src={pictureUrl} />
        </div>
        <div className="post-content">
          <span><strong>{User.name + ' '}</strong></span>
          <span><strong><Link to={`/users/${User.username}`}>@{User.username}</Link></strong></span> {/* <br/> */}
          <span style={{fontSize: "14px", color: "grey"}}>- {this.state.timestamp}</span> <br/>
          <span /* key={id} */>{content}</span> <br/>
          <span style={{fontSize: "14px", color: "grey", cursor: "pointer"}} onClick={() => window.location.assign(`/posts/${post.id}`)}> <i class="far fa-comment"></i>  {Comments.length || ''}</span>
          {/* <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-heart"></i> </span> */}
        </div>
      </div>
    )
  }
}

export default Post