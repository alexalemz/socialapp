import React, { Component, useEffect, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import { Input } from '../components/Form';
import API from '../utils/API';
import { AccountContext, AccountConsumer } from '../providers/AccountProvider';

/* 
  So what we need here is a way to look up the current user's info
  (display name, bio, website, profile picture).
  Then we display those things in the forms, which can be edited. 
  (For the picture, we'll display the current picture, but have a button to upload a new one.)
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
    // Trim the values of name, bio, etc.
    const {name, bio} = this.state;
    formData.set('name', name.trim());
    formData.set('bio', bio.trim());

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

    // Styling
    const borderRadius = '5px';
    const border = "1px solid #d6d6d6";

    const descriptionStyle = {
      borderBottom: border,
      marginBottom: '30px',
      // paddingLeft: '20px',
      // position: 'relative',
      // left: '-20px',
    }
    const imgStyle = {
      // maxWidth: '20%', 
      // maxHeight: '20%', 
      maxWidth: '220px', 
      maxHeight: '220px', 
      borderRadius: '10%', 
      margin: '10px 0'
    };
    const nameStyle = {
      padding: '5px 10px',
      border,
      borderRadius,
      width: '300px'
    };
    const bioStyle = {
      resize: 'none',
      padding: '5px 10px',
      border,
      borderRadius,
      width: '300px',
      height: '100px'
    };

    return (
      <div className="container py-4" id="edit-profile-page">
        {/* Hello, there! <br/> */}
        {/* Description */}
        <div style={descriptionStyle}>
          <h2>Profile Editor</h2>
          <p style={{}} className='text-muted'>You can edit the details of your profile including display name, bio, website, profile picture, etc.</p>
        </div>
        {/* <br/> */}

        <form action='/api/users/profile' method='post' enctype='multipart/form-data' id='editProfileForm'
          onChange={this.handleInputChange}
          onSubmit={this.submitForm}
        >
          <Form.Group>
            <label for='profilepicture'>Profile picture</label> <br/>
            {/* Display the current profile picture */}
            {this.state.picture && <><img style={imgStyle} src={this.state.picture} /> <br/></>}
            <input type='file' name='profilepicture' id='profilepicture' accept='image/*' className='btn' /> <br/>
          </Form.Group>

          <Form.Group>
            <label for='name'>Name</label> <br/>
            <input type='text' name='name' id='name' value={this.state.name} style={nameStyle} /> <br/>
          </Form.Group>

          <Form.Group>
            <label for='bio'>Bio</label> <br/>
            <textarea name='bio' id='bio' value={this.state.bio} style={bioStyle} /> <br/>
          </Form.Group>

          {/* <label for='website'>Website</label> <br/> */}
          {/* <input type='text' name='website' id='website' value={this.state.website} /> <br/> */}

          <input type='submit' value='Save changes' className='btn btn-primary mt-2' />
        </form>
      </div>
    )
  }

}