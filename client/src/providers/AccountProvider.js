// src/providers/AccountProvider.js
import React, { Component } from 'react'

// Set Up The Initial Context
export const AccountContext = React.createContext()

// Create an exportable consumer that can be injected into components
export const AccountConsumer = AccountContext.Consumer

// Create the provider using a traditional React.Component class
class AccountProvider extends Component {
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

  render () {
    return (
      // value prop is where we define what values 
      // that are accessible to consumer components
      <AccountContext.Provider value={this.state}>
        {this.props.children}
      </AccountContext.Provider>
    )
  }
}

export default AccountProvider