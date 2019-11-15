import React, { Component } from 'react';

export default class FollowButton extends Component {
  // Create a hover variable or state, that keeps track of if the button is being hovered over.
  // Based on the hover status, we can determine what the followed button will look like.
  // If a user is following, it will say Following, when not hovered, but it will say Unfollow when hovered.

  state = {
    hover: false
  }

  hoverOn = () => {
    this.setState({hover: true});
  }

  hoverOff = () => {
    this.setState({hover: false});    
  }

  render() {
    const { isFollowing, isCurrentUser, handleFollow, handleUnfollow } = this.props;

  
    if (isFollowing === undefined || isCurrentUser === undefined || isCurrentUser) {
      return (' ')
    }
    else if (isFollowing) {
      const {hover} = this.state;
      
      let btnClass = hover ? "btn btn-danger" : "btn btn-primary";
      let btnText = hover ? "Unfollow" : "Following";
  
      return (
        <button className={btnClass + " follow-button"} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} onClick={handleUnfollow}>{btnText}</button>
      )
    }
    else {
      return (
        <button className="btn btn-outline-primary" onClick={handleFollow}>Follow</button>
      )
    }

  }


  // return (
  //   isFollowing === undefined || isCurrentUser === undefined && ' ' //While loading info, don't display yet
  //   || isCurrentUser && ' ' 
  //   || isFollowing && <button className="btn btn-primary">Following</button>
  //   || <button className="btn btn-secondary">Follow</button>
  // )
}