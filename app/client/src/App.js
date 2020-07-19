import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

import Init from './components/init.js';
import Main from './components/app.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      web3Adapter: false,
    }
    this.initLoader = this.initLoader.bind(this);
  }

  initLoader(web3Adapter) {
    this.setState({web3Adapter: web3Adapter, loading: false});
  }

  render() {
    let disp = (<></>);
    if (this.state.loading) {
      disp = (
        <Init
          initLoader={this.initLoader.bind(this)}
        />
      )
    } else {
      disp = (
        <Main
          web3Adapter={this.state.web3Adapter}
        />
      );
    }
    return (
      <div className="app">
        {disp}
      </div>
    )
  }
}

export default App;
