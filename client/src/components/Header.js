import React, { Component, useContext, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { withRouter } from 'react-router'
// import { AUTH_TOKEN } from '../constants'
import { AccountContext, AccountConsumer } from '../providers/AccountProvider';
import API from '../utils/API';

const Header = (props) => {
  const accountInfo = useContext(AccountContext);
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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Social App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
          <NavLink exact to="/users" className="nav-item nav-link">Users</NavLink>
        </div>
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
      <div className="mr-2">
        {accountInfo.username || "Please log in"}
      </div>
      {accountInfo.username ? 
        <button onClick={() => {
          API.logout().then(res => {
            console.log("Logged out.")
            history.push('/');
          })}
        }>Logout</button> :
        <Link to="/login">Login</Link>
      }
    </nav>
  )
}

export default withRouter(Header)
// export default Header;