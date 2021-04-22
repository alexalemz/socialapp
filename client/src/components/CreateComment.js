import React, { Component } from 'react'
import API from '../utils/API'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

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
      <Container>
        <Row>
          <textarea 
            // The style should be the same as in CreatePost
            style={{
              width: "100%",
              resize: "none",
              border: "1px solid #d6d6d6",
              padding: "5px 10px",
              borderRadius: "5px"
              // margin: "10px",
            }}
            maxLength="280"
            placeholder="Make a comment"
            value={content}
            onChange={e => this.setState({ content: e.target.value })}
          />
        </Row>
        <Row className="mt-1">
          <input className="btn btn-primary ml-auto" type="submit" value="Comment" onClick={this.handleSubmit} />
        </Row>

      </Container>
    )
  }
}

export default CreateComment