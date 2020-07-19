import React, { Component } from 'react';
import {Card, Button, Grid, Form} from 'semantic-ui-react'

export default class Functions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3Adapter: this.props.web3Adapter ? this.props.web3Adapter : false,
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.adapterCb = this.adapterCb.bind(this)
    this.functionForms = this.functionForms.bind(this);
    this.addToLog = this.props.addToLog;
    this.toggleDimmer = this.props.toggleDimmer;
  }

  handleChange(fn, f, event) {
    let fields = this.state[fn];
    if (!fields) { fields = {} }
    fields[f] = event.target.value
    this.setState({
      [fn] : fields
    });
  }

  handleSubmit(abiFn, event) {
    event.preventDefault();
    this.toggleDimmer();
    this.state.web3Adapter.method(abiFn, this.state[abiFn.name], this.adapterCb)
  }

  functionForms() {
    var self = this;
    return this.state.web3Adapter.ABI.map(function(e,i) {
      if (e.type === 'event' || e.type === 'constructor') {
        return (<></>);
      }
      return (
        <Card>
        <Card.Content>
        <Form key={i} onSubmit={(data) => self.state.web3Adapter.method(e, data)}>
          <Form.Field>
          <h4>{e.name}</h4>
          {e.inputs.map((E,i) => {
              return(<><label key={i}>{E.name}</label><input id={E.name} onChange={(event) => {self.handleChange(e.name, E.name, event)}} placeholder={E.type}/></>)
            })
          }
          </Form.Field>
          <Button color={e.stateMutability === 'view' ? 'blue' : 'green'} onClick={(event) => {self.handleSubmit(e, event)}} type='submit'>{e.stateMutability === 'view' ? 'Call' : 'Send'}</Button>
        </Form>
        </Card.Content>
        </Card>
      )
    })
  }

  copyToClipboard() {
    try {
      navigator.clipboard.writeText(this.state.web3Adapter.selectedAddress);
    } catch (ex) {
      console.log('fail')
    }
  };

  async adapterCb(event, err) {
    this.toggleDimmer();
    this.addToLog(event, err)
  }

  render() {
    return (
      <>
        <Grid.Column>
          <Card.Group className="cards" centered>
            {this.functionForms()}
          </Card.Group>
        </Grid.Column>
      </>
    )
  }
}
