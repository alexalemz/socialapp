import React, { Component } from 'react'
import API from '../utils/API'

class CreatePost extends Component {
  state = {
    content: '',
    disabledStatus: true, // Whether the submit button is disabled
  }

  handleSubmit = (event) => {
    event.preventDefault();

    API.createPost({content: this.state.content}).then(res => {
      this.setState({content: ''})

      window.location.reload();
    })
  }

  handleChange = (event) => {
    // Set content to whatever is in the text box, 
    // then set disabledStatus to true if content is empty, and false otherwise.
    this.setState({ content: event.target.value }, () => {
      this.setState({
        disabledStatus: this.state.content.length === 0,
      })
    });
  }

  render() {
    const { content, disabledStatus } = this.state;
    return (
      <div>
        <textarea 
          placeholder="What's on your mind?"
          value={content}
          // onChange={e => this.setState({ content: e.target.value })}
          onChange={this.handleChange}
        />
        <input type="submit" value="Post" onClick={this.handleSubmit} disabled={disabledStatus} />

      </div>
    )
  }
}

export default CreatePost