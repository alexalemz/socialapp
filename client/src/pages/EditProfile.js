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

export default class EditProfile extends Component {
  state = {
    username: this.props.match.params.username,
    name: undefined,
    followers: [],
    followeds: [],
    isFollowing: undefined,
    isCurrentUser: undefined,
    bio: undefined,
    picture: undefined,
    pictureUpload: undefined, // This is the picture file that the user uploads in the form
  }
  
  componentDidMount() {
    this.loadProfile();
  }

  // Whenever the username in the url changes, we need to load the appropriate user info.
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      console.log("Got some new props")
      this.loadProfile();
    }
  }

  loadProfile = () => {
    const { username } = this.props.match.params;

    API.getUserProfile({username}).then(res => {
      console.log('Edit profile', res.data)
      let { username, name, email, Followers, Followeds, isFollowing, isCurrentUser, bio, picture } = res.data;
      picture = picture && JSON.parse(picture).url;

      this.setState({
        username,
        name,
        followers: Followers,
        followeds: Followeds,
        isFollowing,
        isCurrentUser,
        bio,
        picture,
      })
    })
  }

  handleInputChange = (event) => {
    // Store the form's profile picture in state
    if (event.target.name === 'profilepicture') {
      this.setState({pictureUpload: event.target.files[0]})
    }
    // Store all other fields in state
    else {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  // Submit the form, then redirect to the user's profile (or the home page)
  submitForm = (event) => {
    event.preventDefault();

    // This is the easy way to construct FormData
    let formData = new FormData(document.getElementById('editProfileForm'));
    // This is the other way...
    // let formData = new FormData();
    // formData.append('name', this.state.name);
    // formData.append('bio', this.state.bio);
    // formData.append('profilepicture', this.state.pictureUpload);

    API.editUserProfile(formData).then(res => {
      console.log('Submitted new profile info.', res);

      // window.location.assign('/');
      window.location.assign(`/users/${this.state.username}`) // Goes back to the user's profile
    }).catch(err => console.log(err))

  }
  
  render() {
    console.log('Edit profile state', this.state);

    return (
      <div className="container">
        {/* Hello, there! <br/> */}
        You can edit the details of your profile including display name, bio, website, profile picture, etc.

        <form action='/api/users/profile' method='post' enctype='multipart/form-data' id='editProfileForm'
          onChange={this.handleInputChange}
          onSubmit={this.submitForm}
        >

          <label for='profilepicture'>Profile picture</label> <br/>
          {/* Display the current profile picture */}
          {this.state.picture && <img style={{maxWidth: '20%', maxHeight: '20%', borderRadius: '10%'}} src={this.state.picture} />}
          <input type='file' name='profilepicture' id='profilepicture' accept='image/*' className='btn' /> <br/>

          <label for='name'>Name</label> <br/>
          <input type='text' name='name' id='name' value={this.state.name} /> <br/>

          <label for='bio'>Bio</label> <br/>
          <textarea name='bio' id='bio' value={this.state.bio} /> <br/>

          {/* <label for='website'>Website</label> <br/> */}
          {/* <input type='text' name='website' id='website' value={this.state.website} /> <br/> */}

          <input type='submit' value='Save changes' className='btn btn-primary' />
        </form>
      </div>
    )
  }

}