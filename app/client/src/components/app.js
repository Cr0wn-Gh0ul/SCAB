import React, { Component } from 'react';
import {Header, Dimmer, Loader, Divider, Grid} from 'semantic-ui-react'

import ContractFunctions from './app/functions.js';
import AddressHeader from './app/header.js';
import Log from './app/log.js';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      web3Adapter: this.props.web3Adapter ? this.props.web3Adapter : false,
      dimmer: false
    }
    this.addToLog = this.addToLog.bind(this)
    this.toggleDimmer = this.toggleDimmer.bind(this);
  }

  async addToLog(logMsg, err) {
    let logs = this.state.logs
    logs.push(logMsg)
    this.setState({logs: logs})
    document.getElementById('logs').scrollTo(0, document.body.scrollHeight);
  }

  async toggleDimmer() {
    await this.setState({dimmer: !this.state.dimmer})
  }

  render() {
    return (
      <>
        <Dimmer active={this.state.dimmer}>
          <Loader />
        </Dimmer>

        <Grid>

          <Grid.Row centered columns={2}>
            <AddressHeader
              web3Adapter={this.state.web3Adapter}
            />
          </Grid.Row>

          <Divider />

          <Grid.Row centered columns={2} >

            <Grid.Column textAlign='center' className="contractFunctions">
              <Header textAlign='center' as='h2'>Methods</Header>
              <ContractFunctions
                web3Adapter={this.state.web3Adapter}
                toggleDimmer={this.toggleDimmer.bind(this)}
                addToLog={this.addToLog.bind(this)}
              />
            </Grid.Column>

            <Grid.Column centered id="logs" className="logs">
              <Header textAlign='center' as='h2'>Log</Header>
              <Log
                logs={this.state.logs}
              />
            </Grid.Column>

          </Grid.Row>

        </Grid>
      </>
    )
  }
}
