import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import DivImg from './DivImg';

// Display the user's profile picture, name, username, 
// Follow button, bio, whether that person is following me

const  UserCard = (props) => {
  const {user} = props;
  const {username} = user;
  const pictureUrl = user.picture ? JSON.parse(user.picture).url : null;
  const userUrl = `/users/${username}`;

  const style = {
    // border: '1px solid grey',
  }

  return (
    <div style={style} className="row user-card">
      <div className="user-card-col1">
        <Link to={userUrl}>
          <DivImg className="user-card-img" imgUrl={pictureUrl} />
        </Link>
        {/* <img className="user-card-img" src={pictureUrl}  */}
        {/* style={{width: 100, height: 100}} */ }
        {/* /> */}
      </div>
      <div className="user-card-col2">
        <p className="user-name"><strong>{user.name}</strong></p>
        <p className="user-username"><Link to={userUrl}>@{username}</Link></p>
        <p>{user.bio}</p>
      </div>
    </div>
  )
}

export default UserCard;