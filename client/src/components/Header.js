import React, { Component, useContext, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
// import { AUTH_TOKEN } from '../constants'
import { AccountContext, AccountConsumer } from '../providers/AccountProvider';
import API from '../utils/API';

const Header = (props) => {
  const accountInfo = useContext(AccountContext);
  console.log('In Header AccountInfo', accountInfo);
  const { history } = props;

  useEffect( () => {
    console.log("Header UseEffect");
    API.user_data().then(res => {
      let userInfo = res.data;
      console.log("In Header componentWillMount", userInfo);
      if (userInfo.username !== accountInfo.username) {
        console.log("Updating account")
        accountInfo.updateAccount(userInfo);
      }
    });
  })

  const logOut = () => {
    API.logout().then(res => {
      console.log("Logged out.")
      history.push('/');
    })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Social App</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink exact to="/home" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/users" className="nav-link">Users</NavLink>
          </li>
          <li className="nav-item">
            {/* Link to take user to their own profile page */}
            {accountInfo.username && <NavLink exact to={`/users/${accountInfo.username}`} className="nav-link">Profile</NavLink>}
          </li>
          <li>
            <SignInButton accountInfo={accountInfo} logOut={logOut} className="d-inline d-md-none" />
          </li>
        </ul>
      </div>
      {/* <div>
        {authToken ? (
          <div
          className="ml1 pointer black"
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN)
            this.props.history.push(`/`)
          }}
        >
          logout
        </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div> */}
      {/* Log in/out button and user info */}
      <SignInButton accountInfo={accountInfo} logOut={logOut} className="d-none d-md-inline" />
    </nav>
  )
}

const SignInButton = (props) => {
  const { accountInfo, logOut } = props;

  return (
    <span className={props.className} style={{margin: 0, padding: 0}}>
      <div className="mr-2 d-inline">
        {accountInfo.username || "Please log in"}
      </div>
      {accountInfo.username ? 
        <button className="btn btn-secondary" onClick={logOut}>Sign out</button> :
        <Link className="btn btn-secondary" to="/login">Sign in</Link>
      }
    </span>
  )
}

export default withRouter(Header)
// export default Header;