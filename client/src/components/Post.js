import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import DivImg from './DivImg'
import API from '../utils/API'
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
    const dayDiff = moment().diff(momentCreated, 'day');
    const minuteDiff = moment().diff(momentCreated, 'minute');
    const yearDiff = moment().diff(momentCreated, 'year');
    let timestamp = momentCreated.fromNow(0);;
    if (minuteDiff < 1)
      timestamp = moment().diff(momentCreated, 'second') + 's';
    else if (hourDiff < 1)
      timestamp = `${minuteDiff}m`;
    else if (hourDiff < 21)
      timestamp = `${hourDiff}h`
    else if (dayDiff < 7)
      timestamp = `${dayDiff}d`;
    else if (yearDiff < 1)
      timestamp = momentCreated.format('D MMM');
    else
      timestamp = momentCreated.format('D MMM \'YY');
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

  handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      API.deletePost(this.props.post.id).then(dbPost => {
        window.location.reload();
      });
    }
  }

  render() {
    const { post, post: {User, content, Comments} } = this.props;
    // console.log("In Post.js User:", User)
    const pictureUrl = User.picture ? JSON.parse(User.picture).url : null;
    const userUrl = `/users/${User.username}`;
    return (
      <div className="post-container bg-white" style={{
        /* border: 'solid black 1px',
        borderRadius: '15px',
        padding: '10px',
        margin: '10px 0', */
      }}>
        <div className="post-user-img-container">
          {/* <Link to={userUrl}><img className="post-user-img" src={pictureUrl} /></Link> */}
          {/* Making the profile picture a div, so it won't be squashed if the picture isn't square. */}
          <Link to={userUrl}>
            <DivImg className="post-user-img" imgUrl={pictureUrl}/>
            {/* <div className="post-user-img" 
              style={{
                backgroundImage: `url(${pictureUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            /> */}
          </Link>
        </div>
        <div className="post-content">
          <span><strong>{User.name + ' '}</strong></span>
          <span><Link to={userUrl}>@{User.username}</Link></span> {/* <br/> */}
          <span className="post-timestamp">&middot; {this.state.timestamp}</span> <br/>
          <span /* key={id} */>{content}</span> <br/>
          {/* This comment icon goes to the post details page by window.location.assign */}
          {/* <span className="post-comments" onClick={() => window.location.assign(`/posts/${post.id}`)}> <i className="far fa-comment"></i>  {Comments.length || ''}</span> */}
          {/* This comment icon goes to the post details page because it's wrapped by a link */}
          <Link to={`/posts/${post.id}`} style={{textDecoration: 'none'}}>
            <span className="post-comments"> <i className="far fa-comment"></i>  {Comments.length || ''}</span>
          </Link>
          {/* <span style={{fontSize: "14px", color: "grey"}}> <i className="far fa-heart"></i> </span> */}
        </div>
        {/* Dropdown options (for now, only on user's own posts) */}
        {post.fromCurrentUser ? 
          <DropdownButton variant="white" title="" alignRight id="dropdown-basic-button" className="ml-auto">
            <Dropdown.Item as="button" style={{color: "gray"}} onClick={this.handleDelete}>Delete post</Dropdown.Item>
            {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
          </DropdownButton>
          : ''
        }
      </div>
    )
  }
}

export default Post