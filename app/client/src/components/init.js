import React, { Component } from 'react';
import {Dimmer, Loader } from 'semantic-ui-react';
import Web3Adapter from '../classes/web3Adapter.js';
import { channels } from '../shared/constants';
const { ipcRenderer } = window;

export default class Init extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: '',
      dimmer: true
    }
    this.initLoader  = this.props.initLoader.bind(this);
    this.adapterCb = this.adapterCb.bind(this)
  }
  async componentDidMount() {
    ipcRenderer.send(channels.CONTRACT);
    ipcRenderer.on(channels.CONTRACT, async (event, contract) => {
      ipcRenderer.removeAllListeners(channels.CONTRACT);
      let web3Adapter = new Web3Adapter(contract.byteCode, contract.ABI, contract.name ? contract.name : false, contract.constructorArgs ? contract.constructorArgs : []);
      await this.setState({web3Adapter: web3Adapter, bytecode: contract.byteCode, abi: contract.ABI})
      this.state.web3Adapter.init(this.adapterCb);
    });
  }

  async adapterCb(event, err) {
    this.setState({dimmer: false});
    if (event !== 'ready') {
      this.setState({notify: event})
      return;
    }
    this.initLoader(this.state.web3Adapter);
  }

  render() {
    return (
      <>
        <Dimmer active={this.state.dimmer}>
          <Loader>Initializing</Loader>
        </Dimmer>
        <p>{this.state.notify}</p>
      </>
    )
  }
}
