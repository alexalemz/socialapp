import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

  render() {
    const { comment, comment: {User, content, Comments} } = this.props;
    return (
      <div style={{
        border: 'solid black 1px',
        borderRadius: '15px',
        padding: '10px',
        margin: '10px 0',
      }}>
        <span><b><Link to={`/users/${User.username}`}>@{User.username}</Link></b></span> {/* <br/> */}
        <span style={{fontSize: "14px", color: "grey"}}>- {this.state.timestamp}</span> <br/>
        <span /* key={id} */>{content}</span> <br/>
        {/* <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-comment"></i>  {Comments.length || ''}</span> */}
        {/* <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-heart"></i> </span> */}
      </div>
    )
  }
}