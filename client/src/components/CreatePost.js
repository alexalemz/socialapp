import React, { Component } from 'react'
import API from '../utils/API'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

class CreatePost extends Component {
  state = {
    content: '',
    disabledStatus: true, // Whether the submit button is disabled
    inFocus: false,
  }

  handleSubmit = (event) => {
    event.preventDefault();

    API.createPost({content: this.state.content.trim()}).then(res => {
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

  handleClick = (event) => {
    if (this.state.inFocus) {

    }
    else {
      this.setState({inFocus: true});
    }
  }

  render() {
    const { content, disabledStatus, inFocus } = this.state;
    return (
      <Container>
        <Row>
          <textarea 
            style={{
              width: "100%",
              resize: "none",
              border: "1px solid #d6d6d6",
              padding: "5px 10px",
              borderRadius: "5px"
              // margin: "10px",
            }}
            maxLength="280"
            // rows={inFocus ? 3 : 1}
            placeholder="What's on your mind?"
            value={content}
            // onChange={e => this.setState({ content: e.target.value })}
            onChange={this.handleChange}
            onClick={(e) => this.handleClick(e)}
          />
        </Row>
        <Row className="mt-1">
          <span className="" style={{color: "grey", fontSize: ".8rem"}}>{content.length > 0 ? ( (280 - content.length) /* + '/280' */ ) : '' } </span>
          <input className="btn btn-primary ml-auto" type="submit" value="Post" onClick={this.handleSubmit} disabled={disabledStatus} />
        </Row>
      </Container>
    )
  }
}

export default CreatePost