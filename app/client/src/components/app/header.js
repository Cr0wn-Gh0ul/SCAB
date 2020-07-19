import React, { Component } from 'react';
import {Icon, Dropdown, Button, Grid} from 'semantic-ui-react'

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3Adapter: this.props.web3Adapter ? this.props.web3Adapter : false,
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  copyToClipboard() {
    try {
      navigator.clipboard.writeText(this.state.web3Adapter.selectedAddress);
    } catch (ex) {
      console.log('fail')
    }
  };


  render() {
    let accounts = []
    this.state.web3Adapter.accounts.map((e,i) => {
      return accounts.push({key: e, value: e, text: e})
    });
    let balance = this.state.web3Adapter.balance;
    let selectedAddress = this.state.web3Adapter.selectedAddress;
    return (
      <>
        <Grid.Column textAlign='center'>
          <h4>{this.state.web3Adapter.name ? this.state.web3Adapter.name : 'Contract'}</h4>
          <h4>{this.state.web3Adapter.contract.options.address}</h4>
        </Grid.Column>
        <Grid.Column centered textAlign='center'>
          <h4>Account Address</h4>
          <Dropdown
            value={selectedAddress}
            options={accounts}
            onChange={async (e,d) => {await this.state.web3Adapter.selectAddress(d.value); this.forceUpdate()}}
          />
          <Button icon onClick={() => {this.copyToClipboard()}}>
            <Icon name='clipboard' />
          </Button>
        </Grid.Column>
        <Grid.Row>
          <p>Balance: {balance}</p>
        </Grid.Row>
      </>
    )
  }
}
