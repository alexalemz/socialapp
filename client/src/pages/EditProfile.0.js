import React, { Component, useEffect, useContext } from 'react';
import { Input } from '../components/Form';
import API from '../utils/API';
import { AccountContext, AccountConsumer } from '../providers/AccountProvider';

/* 
  So what we need here is a way to look up the current user's info
  (display name, bio, website, profile picture).
  Then we display those things in the forms, which can be edited. 
  (For the picture, we'll display the current picture, but have a button to upload a newe one.)
  There will be a save button to save the changes.
*/

const EditProfile = (props) => {
  const accountInfo = useContext(AccountContext);
  const { history } = props;  

  useEffect( () => {
    // console.log("Header UseEffect");
    API.getUserProfile().then(res => {
      const { username, name, email, Followers, Followeds, isFollowing, isCurrentUser } = res.data;
      console.log("in edit profile. User's name is ", name)
    })
    // API.user_data().then(res => {
    //   let userInfo = res.data;
    //   console.log("In Header componentWillMount", userInfo);
    //   if (userInfo.username !== accountInfo.username) {
    //     console.log("Updating account")
    //     accountInfo.updateAccount(userInfo);
    //   }
    // });
  })
  
  return (
    <div className="container">
      Hello, there! <br/>
      You can edit the details of your profile including display name, bio, website, profile picture, etc.
    </div>
  )
    
}

export default EditProfile;