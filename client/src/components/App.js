import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Users from "../pages/Users";
import UserProfile from "../pages/UserProfile";
import UserFollows from "../pages/UserFollows";
import PostDetails from "../pages/PostDetails";
import EditProfile from "../pages/EditProfile";
import Settings from "../pages/Settings";
import Header from "./Header";
import '../styles/App.css';
import AccountProvider, { AccountContext, AccountConsumer } from '../providers/AccountProvider';

class App extends Component {
  state = {
    id: '',
    username: '',
    email: '',
    updateAccount: updatedAccount => this.updateAccount(updatedAccount),
  }

  updateAccount = updatedAccount => {
    this.setState(prevState => ({
      ...prevState,
      ...updatedAccount
    }))
  }

  render() {
    console.log('Account Context: ', AccountContext);
    console.log('Account Provider: ', AccountProvider);
    console.log('Account Consumer: ', AccountConsumer);

    return (
      <AccountProvider value={this.state}>
        <Router>
          <div className="bg-light" 
            style={{
              // This makes the background fill up the whole height of the page, even when there isn't much content on the page.
              minHeight: '100vh',
              paddingBottom: '10px'
            }} 
          >
            <Header />
            {/* <AccountConsumer>
              {(value) => ( */}
                <Switch>
                  {/* <Route exact path="/" component={Home} /> */}
                  <Route exact path="/" render={() => (
                    this.state.username || true ? 
                      // <Home/> 
                      <Redirect to='/home' />
                    : 
                      <Redirect to='/login'/>
                      // <Login/>
                  )} />
                  <Route exact path="/home" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/users" component={Users} />
                  <Route path="/users/:username" component={UserProfile} />
                  {/* <Route exact path="/users/:username/followers" component={UserFollows} /> */}
                  {/* <Route exact path="/users/:username/following" component={UserFollows} /> */}
                  {/* <Route exact path="/users/:username/follows" component={UserFollows} /> */}
                  <Route exact path="/posts/:PostId" component={PostDetails} />
                  <Route exact path="/settings" component={Settings} />
                  <Route exact path="/editprofile" component={EditProfile} />
                </Switch>
              {/* ) }
            </AccountConsumer> */}
          </div>
        </Router>
      </AccountProvider>
    );
  }
}

export default App;
