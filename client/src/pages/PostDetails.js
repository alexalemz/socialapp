import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/API'
import Comment from '../components/Comment'
import CreateComment from '../components/CreateComment'
import DivImg from '../components/DivImg'
import { AccountConsumer } from '../providers/AccountProvider';

const moment = require('moment')

// We want to look up a post with the given id.
// This will display the post and all of it's comments.
export default class PostDetails extends Component {
  state = {
    id: undefined,
    content: '',
    createdAt: undefined,
    User: {},
    Comments: [],
    loaded: false,
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { PostId } = this.props.match.params;
    console.log('PostId', PostId)
    API.getPostDetails(PostId).then(res => {
      const { id, content, createdAt, User, Comments } = res.data;
      this.setState({id, content, createdAt, User, Comments, "loaded": true});
    })
  }

  render() {
    const { id, content, createdAt, User, Comments, loaded } = this.state;
    let contextValue = this.context;
    let username = contextValue.username;
    const pictureUrl = loaded && User ? JSON.parse(User.picture).url : null;

    console.log("PostDetails User object", User)
  

    return (
      <AccountConsumer>
        {value => (
          loaded ? <div className="container">
            <div className="post-details">
              <div><a href={`/users/${User.username}`}>
                <DivImg className="post-details-user-img" imgUrl={pictureUrl}/>
                </a>
              </div>
              <div>
                <div className=""><a href={`/users/${User.username}`} style={{textDecoration: 'none', color: 'inherit'}}>
                  <span style={{fontSize: '20px', fontWeight: 'bold'}}>{User.name}</span> <span style={{fontSize: '16px', color: 'grey'}}>@{User.username}</span>
                  </a>
                </div>
                <div className="">
                  <p style={{fontSize: '28px', marginBottom: '.25rem'}}>{content}</p>
                </div>
                <div className="">
                  <span style={{fontSize: '14px', color: 'grey'}}>{moment(createdAt).format('h:mm A - MMM D YYYY')}</span> 
                  <br/>
                  <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-comment"></i>  {Comments.length || ''}</span>
                </div>
              </div>
            </div>
            <div>
              { value.username ? <CreateComment PostId={id} /> : 
                <div class="alert alert-dark" role="alert">
                  You must be signed in to comment.
                </div>
              }
            </div>
            <div>
              {Comments.length && Comments.map(comment => (
                <Comment comment={comment} />
              )) || ''}
            </div>

          </div> : <div/>

        )}
      </AccountConsumer>
    )
  }
}