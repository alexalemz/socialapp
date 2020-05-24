import React, { Component, useEffect, useContext } from 'react';
import { Input } from '../components/Form';
import API from '../utils/API';
import { getSubscription, subscribeUser, unsubscribeUser } from '../subscription';
import { AccountContext, AccountConsumer } from '../providers/AccountProvider';
import Container from 'react-bootstrap/Container';
// import Switch from 'rc-switch';
// import '../../node_modules/rc-switch/assets/index.css';
import Switch from '../components/Switch/Switch';
import axios from 'axios';

export default class Settings extends Component {
  state = {
    pushSubscriptionStatus: undefined,
    'np_new_comment': undefined,
    np_new_post: undefined,
    np_new_follower: undefined,
    np_new_like: undefined,
  }

  componentDidMount() {
    this.updateState();
  }

  updateState = () => {
    console.log("\n\nUpdating the state")
    getSubscription().then(existedSubscription => {
      // Also check if the subscription is associated with logged-in user.
      axios.post('/notifications/subscriptionStatus', existedSubscription).then(response => {
        const subscriptionExists = response.data;
        console.log("\n\nThe value of subscriptionExists is ", subscriptionExists)
        axios.get('/notifications/preferences').then(({data: notificationPrefs}) => {
          console.log("notification preferences:", notificationPrefs)
          const np_types = {};
          for (let np of notificationPrefs) {
            np_types[`np_${np.notification_type}`] = np.enabled;
          }
  
          this.setState({
            // pushSubscriptionStatus: existedSubscription !== null,
            pushSubscriptionStatus: subscriptionExists,
            ...np_types,
          })
        })
      })
    })
  }

  handleSwitchChange = () => {
    console.log("\n\n\nHandling switch change")
    const checked = this.state.pushSubscriptionStatus;
    if (checked) {
      // unsubscribe push notifications
      unsubscribeUser();
    }
    else {
      // subscribe push notifications
      subscribeUser();
    }
    this.setState({pushSubscriptionStatus: !checked});
  }

  handleNPSwitchChange = (npType) => {
    if (npType === 'new_comment') {
      axios.post('/notifications/preferences', {
        notification_type: 'new_comment',
        enabled: !(this.state['np_new_comment']),
      }).then(result => {
        // Set the state temporarily, then call update state to make sure 
        // all settings are reflected correct.
        this.setState({
          'np_new_comment': !(this.state['np_new_comment'])
        }, /* () => this.updateState() */)
        // this.updateState();
      })
    }
    else {
      axios.post('/notifications/preferences', {
        notification_type: npType,
        enabled: !(this.state[`np_${npType}`]),
      }).then(result => {
        // Set the state temporarily, then call update state to make sure 
        // all settings are reflected correct.
        this.setState({
          [`np_${npType}`]: !(this.state[`np_${npType}`])
        }, /* () => this.updateState() */)
        // this.updateState();
      })
    }
  }

  render() {
    return (
      <Container>
        <h3>Settings</h3>
        {this.state.pushSubscriptionStatus !== undefined ? <div style={{ /* margin: 20 */ }}>
          <Switch
            id="push-notifications-switch"
            checked={this.state.pushSubscriptionStatus}
            onChange={this.handleSwitchChange}
          /> Notifications
          {/* <label for="push-notifications-switch"> */}
            {/* Notifications */}
          {/* </label> */}

          <br/><br/>
          <button onClick={() => {
            getSubscription().then(existedSubscription => {
              if (existedSubscription !== null) {
                axios.post('/notifications/test', existedSubscription)
              }
              else {
                console.log("There is no subscription")
              }
            })
          }}>Send test notification</button>
          <hr/>
          <h4>Notification preferences</h4>
          <ul style={{listStyle: 'none', padding: '0px 15px'}}>
            <li>
              <Switch 
                id="new-comment-switch"
                checked={this.state.np_new_comment === true}
                onChange={() => this.handleNPSwitchChange('new_comment')}
              /> Someone comments on your post
            </li>
            <li>
              <Switch 
                id="new-post-switch"
                checked={this.state.np_new_post === true}
                onChange={() => this.handleNPSwitchChange('new_post')}
              /> Someone you follow makes a new post
            </li>
            <li>
              <Switch 
                id="new-follower-switch"
                checked={this.state.np_new_follower === true}
                onChange={() => this.handleNPSwitchChange('new_follower')}
              /> Someone follows you
            </li>
          </ul>
        </div> : ""}
      </Container>
    )
  }
}
