const Web3 = require('web3');

class Web3Adapter {
  constructor(byteCode, ABI, name, constructorArgs) {
    this.byteCode = byteCode;
    this.ABI = ABI;
    this.name = name;
    this.constructorArgs = constructorArgs;
    this.web3 = false;
    this.selectedAddress = ''
    this.accounts = false;
    this.balance = '';

    this.connAttempt = 1;
  }

  async init(cb) {
    let accounts, web3;
    try {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      accounts = await web3.eth.getAccounts()
    } catch(ex) {
      if (this.connAttempt > 5) { return }
      this.connAttempt++;
      setTimeout(() => {this.init(cb)}, 3000);
      return;
    }
    this.web3 = web3;
    this.selectedAddress = accounts[0];
    this.accounts = accounts;
    if (!this.byteCode || !this.ABI) {
      cb.call(this, 'Missing bytecode or abi.')
      return;
    }
    let contract = new this.web3.eth.Contract(this.ABI);
    let deploy = await contract.deploy({data: this.byteCode, arguments: this.constructorArgs});
    try {
      await deploy.send({
        from: this.selectedAddress,
        gas: 1500000,
        gasPrice: '1'
      }, function(error, transactionHash){ })
      .on('error', function(error) {
         throw error;
      })
      .on('receipt', function(receipt) {
        contract.options.address = receipt.contractAddress
      })
    } catch(ex) {
      cb.call(this, 'Error deploying contract')
    }

    this.contract = contract;

    await this.updateBalance();
    cb.call(this, 'ready');
  }

  async method(m, data, cb) {
    let args = []
    for (let i = 0; i < m.inputs.length; i++) {
      if (data[m.inputs[i].name]) {
        args.push(data[m.inputs[i].name]);
      }
    }
    if (args.length !== m.inputs.length) { return false }
    let resp;

    if (m.stateMutability === 'view') {
      resp = await this.call(m, args);
    } else {
      resp = await this.send(m, args);
    }
    await this.updateBalance();
    cb.call(this, resp);
  }


  async call(fn, args) {
    let resp = false;
    try {
      if (args && args.length > 0) {
        resp = await this.contract.methods[fn.name](...args).call({from:this.selectedAddress});
      } else {
        resp = await this.contract.methods[fn.name]().call({from:this.selectedAddress});
      }
    } catch(ex) {
      resp = ex;
    }
    return resp;
  }

  async send(fn, args) {
    let resp = false;
    try {
      if (args && args.length > 0) {
        resp = await this.contract.methods[fn.name](...args).send({from:this.selectedAddress});
      } else {
        resp = await this.contract.methods[fn.name]().send({from:this.selectedAddress});
      }
    } catch(ex) {
      resp = ex;
    }
    return resp;
  }

  async selectAddress(address) {
    if (!this.accounts.includes(address)) {
      return false;
    }
    await this.updateBalance(address);
    this.selectedAddress = address;
  }

 async updateBalance(address) {
    let balance;
    try {
      balance = await this.web3.utils.fromWei(await this.web3.eth.getBalance(address ? address : this.selectedAddress), 'ether');
    } catch(ex) {
      balance = 'Error';
    }
    this.balance = balance;
    return true;
  }

}
export default Web3Adapter;
