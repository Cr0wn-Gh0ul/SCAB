import React, { Component } from 'react';
import {Container, Divider, Grid} from 'semantic-ui-react'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: this.props.logs ? this.props.logs : [],
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.logs.length !== this.props.logs.length) {
      await this.setState({logs: this.props.logs})
    }
  }

  render() {
    return (
      <>
        <Grid.Column>
          <Container>
            {this.state.logs.map((e,i) => { return (<><p>{JSON.stringify(e, false, ' ')}</p><Divider fitted/></>) })}
          </Container>
        </Grid.Column>
      </>
    )
  }
}
