import React, { Component } from 'react'
import API from '../utils/API'

class CreateComment extends Component {
  state = {
    content: ''
  }

  handleSubmit = (event) => {
    event.preventDefault();

    API.createComment({PostId: this.props.PostId, content: this.state.content.trim()}).then(res => {
      this.setState({content: ''})

      window.location.reload();
    })
  }

  render() {
    const { content } = this.state;
    return (
      <div>
        <textarea 
          placeholder="Make a comment"
          value={content}
          onChange={e => this.setState({ content: e.target.value })}
        />
        <input type="submit" value="Submit" onClick={this.handleSubmit} />

      </div>
    )
  }
}

export default CreateComment