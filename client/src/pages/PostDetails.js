import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/API'
import Comment from '../components/Comment'
import CreateComment from '../components/CreateComment'
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
    Comments: []
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { PostId } = this.props.match.params;
    console.log('PostId', PostId)
    API.getPostDetails(PostId).then(res => {
      const { id, content, createdAt, User, Comments } = res.data;
      this.setState({id, content, createdAt, User, Comments});
    })
  }

  render() {
    const { id, content, createdAt, User, Comments } = this.state;
    let contextValue = this.context;
    let username = contextValue.username;

    return (
      <AccountConsumer>
        {value => (
          <div className="container">
            <div className="">
              @{User.username}
            </div>
            <div className="">
              <h4>{content}</h4>
            </div>
            <div className="">
              <span style={{fontSize: '14px', color: 'grey'}}>{moment(createdAt).format('h:mm A - MMM D YYYY')}</span> 
              <br/>
              <span style={{fontSize: "14px", color: "grey"}}> <i class="far fa-comment"></i>  {Comments.length || ''}</span>
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

          </div>

        )}
      </AccountConsumer>
    )
  }
}