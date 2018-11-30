import { RateLimiter } from 'limiter'
import React from 'react'
import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import NavBar from './navbar.js'
import Deploy from './deploy.js'
import { arbitrableInstanceAt } from './ethereum/arbitrable'
import {
  centralizedArbitratorInstance,
  deployCentralizedArbitrator,
  getDispute,
  getDisputeStatus,
  getOwner
} from './ethereum/centralized-arbitrator'
import web3 from './ethereum/web3'
import Identicon from './identicon.js'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contractAddresses: [],
      selectedAddress: undefined,
      owner: '',
      arbitrationCost: '1'
    }
  }

  scanContracts(networkType, account) {
    const limiter = new RateLimiter(1, 250)
    const api = {
      mainnet: 'api.',
      kovan: 'api-kovan.'
    }
    console.log(networkType)
    const apiPrefix = networkType === 'main' ? api.mainnet : api.kovan

    fetch(
      `https://${apiPrefix}etherscan.io/api?module=account&action=txlist&address=${account}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
    )
      .then(response => response.json())
      .then(data =>
        data.result
          .filter(({ to }) => to === '')
          .map(item => item.contractAddress)
      )
      .then(addresses =>
        addresses.map(address =>
          limiter.removeTokens(
            1,
            async () =>
              await fetch(
                `https://${apiPrefix}etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
              )
                .then(response => response.json())
                .then(data => {
                  if (data.result[0].ContractName == 'CentralizedArbitrator')
                    this.setState(state => ({
                      contractAddresses: [...state.contractAddresses, address]
                    }))
                })
          )
        )
      )
  }

  async componentDidMount() {
    if (window.web3 && window.web3.currentProvider.isMetaMask)
      window.web3.eth.getAccounts((error, accounts) => {
        this.setState({ wallet: accounts[0] })

        console.warn('FETCH')

        web3.eth.net.getNetworkType((error, networkType) => {
          this.setState({ networkType: networkType })
          this.scanContracts(networkType, accounts[0])
        })
      })
    else console.log('MetaMask account not detected :(')

    this.setState({
      selectedAddress: this.state.contractAddresses[0]
    })
  }

  async componentDidUpdate() {
    console.log(this.state.contractAddresses)
  }

  owner = () =>
    getOwner(centralizedArbitratorInstance(this.state.selectedAddress))

  deploy = (account, arbitrationPrice) => async e => {
    e.preventDefault()
    await deployCentralizedArbitrator(account, 123)
  }

  centralizedArbitratorButtons = addresses =>
    addresses.map(address => (
      <button
        className="dropdown-item"
        key={address}
        onClick={e => this.setState({ selectedAddress: e.target.innerHTML })}
      >
        {address}
      </button>
    ))

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  render() {
    console.log(`RENDERING${new Date().getTime()}`)
    console.log(this.state.selectedAddress)
    const {
      networkType,
      contractAddresses,
      selectedAddress,
      owner,
      arbitrationCost
    } = this.state

    return (
      <div className="container">
        {this.state.wallet && (
          <div className="row">
            <div className="col">
              <NavBar wallet={this.state.wallet} />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col">
            {selectedAddress && (
              <Identicon
                bgColor="#4004A3"
                className="identicon"
                color="#009AFF"
                scale={3}
                seed={selectedAddress}
                size={10}
                spotColor="white"
              />
            )}
            <h4>Select An Already Deployed Centralized Arbitrator</h4>
            <div className="dropdown">
              <button
                aria-expanded="false"
                aria-haspopup="true"
                className="btn btn-secondary dropdown-toggle primary"
                data-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                {selectedAddress}
              </button>
              <div
                aria-labelledby="dropdownMenuButton"
                className="dropdown-menu"
              >
                {this.centralizedArbitratorButtons(contractAddresses)}
                <hr />
                <input
                  className="dropdown-item"
                  onKeyUp={e =>
                    e.keyCode == 13 &&
                    this.setState({ selectedAddress: e.target.value })
                  }
                  placeholder="Or enter the address manually and hit enter"
                />
              </div>
            </div>
          </div>

          <div className="col">
            <h4>Deploy A New Centralized Arbitrator</h4>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button
                  class="btn btn-primary"
                  onClick={this.deploy(this.state.wallet)}
                  type="button"
                >
                  Deploy
                </button>
              </div>
              <input
                aria-describedby="basic-addon1"
                aria-label=""
                class="form-control"
                placeholder="Arbitration Price"
                type="text"
                onChange={this.handleArbitrationPriceChange()}
                value={this.state.arbitrationCost}
              />
            </div>
          </div>
        </div>
        <hr className="secondary" />
        {selectedAddress && (
          <div>
            <div className="row">
              <div className="col">
                <ArbitrationPrice
                  activeWallet={this.state.wallet}
                  contractAddress={selectedAddress}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <DisputeList
                  activeWallet={this.state.wallet}
                  contractAddress={selectedAddress}
                  networkType={networkType}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Dashboard
