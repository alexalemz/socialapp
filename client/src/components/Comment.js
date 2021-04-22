import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/API'
const moment = require('moment')

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: ''
    }
  }

  updateTimestamp = () => {
    const {comment: {createdAt}} = this.props;
    const momentCreated = moment(createdAt);
    // If the post is more than a day old, use the date as the timestamp, otherwise say how long ago it was posted.
    const dayDiff =  moment().diff(momentCreated, 'day');
    const timestamp = dayDiff > 0 ? momentCreated.format('MMM D YYYY') : momentCreated.fromNow(true)
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

  handleCommentDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      API.deleteComment(commentId).then(dbComment => {
        window.location.reload();
      });
    }
  }

  render() {
    const { comment, comment: {User, content, Comments} } = this.props;
    return (
      <div style={{
        border: '1px solid rgb(214, 214, 214)',
        borderRadius: '15px',
        padding: '10px',
        margin: '10px 0',
        background: 'white',
      }}>
        {/* <DivImg className="post-details-user-img" imgUrl={pictureUrl}/> */}
        <span style={{fontWeight: 'bold'}}>{User.name}</span> <span><Link to={`/users/${User.username}`} >@{User.username}</Link></span> {/* <br/> */}
        <span style={{fontSize: "14px", color: "grey"}}>- {this.state.timestamp}</span> <br/>
        <span /* key={id} */>{content}</span> <br/>
        {/* <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-comment"></i>  {Comments.length || ''}</span> */}
        {/* <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-heart"></i> </span> */}
        {comment.fromCurrentUser ? (
          <span 
            onClick={(event) => this.handleCommentDelete(comment.id)}
            style={{cursor: 'pointer', color: 'gray', fontSize: '.8rem'}}
          >
              Delete
          </span>
        ) : ''}
      </div>
    )
  }
}