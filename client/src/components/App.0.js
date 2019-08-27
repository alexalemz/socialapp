import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Users from "../pages/Users";
import UserProfile from "../pages/UserProfile";
import UserFollows from "../pages/UserFollows";
import PostDetails from "../pages/PostDetails";
import EditProfile from "../pages/EditProfile";
import Header from "./Header";
// import '../styles/App.css';
import AccountProvider from '../providers/AccountProvider';

class App extends Component {
  render() {
    return (
      <AccountProvider>
        <Router>
          <div className="bg-light">
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/users" component={Users} />
              <Route path="/users/:username" component={UserProfile} />
              {/* <Route exact path="/users/:username/followers" component={UserFollows} /> */}
              {/* <Route exact path="/users/:username/following" component={UserFollows} /> */}
              {/* <Route exact path="/users/:username/follows" component={UserFollows} /> */}
              <Route exact path="/posts/:PostId" component={PostDetails} />
              <Route exact path="/editprofile" component={EditProfile} />
            </Switch>
          </div>
        </Router>
      </AccountProvider>
    );
  }
}

export default App;
