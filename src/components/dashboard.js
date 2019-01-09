import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import Identicon from './identicon.js'
import NavBar from './navbar.js'
import { RateLimiter } from 'limiter'
import React from 'react'
import { deployCentralizedArbitrator } from '../ethereum/centralized-arbitrator'
import web3 from '../ethereum/web3'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arbitrationCost: '',
      contractAddresses: [],
      owner: '',
      selectedAddress: undefined,
      notifications: []
    }
  }

  scanContracts(networkType, account) {
    const limiter = new RateLimiter(1, 250)
    const api = {
      kovan: 'api-kovan.',
      mainnet: 'api.'
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
          limiter.removeTokens(1, async () =>
            fetch(
              `https://${apiPrefix}etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
            )
              .then(response => response.json())
              .then(data => {
                if (data.result[0].ContractName === 'CentralizedArbitrator') {
                  this.setState(state => ({
                    contractAddresses: [...state.contractAddresses, address]
                  }))
                  if (!window.localStorage.getItem(account))
                    window.localStorage.setItem(account, address)
                  else {
                    window.localStorage.setItem(
                      account,
                      window.localStorage
                        .getItem(account)
                        .concat(' ')
                        .concat(address)
                    )
                  }
                }
              })
          )
        )
      )
  }

  async componentDidMount() {
    const { contractAddresses } = this.state
    if (window.web3 && window.web3.currentProvider.isMetaMask)
      window.web3.eth.getAccounts((error, accounts) => {
        if (error) console.error(error)

        this.setState({ wallet: accounts[0] })

        console.warn('FETCH')
      })
    else console.log('MetaMask account not detected :(')

    this.setState({
      selectedAddress: contractAddresses[0]
    })

    window.ethereum.on('accountsChanged', accounts => {
      web3.eth.net.getNetworkType((error, networkType) => {
        if (error) console.error(error)
        console.log(accounts[0])
        this.setState({ networkType: networkType })
        if (accounts[0]) {
          if (window.localStorage.getItem(accounts[0]))
            this.setState({
              contractAddresses: window.localStorage
                .getItem(accounts[0])
                .split(' ')
            })
          else {
            this.setState({ contractAddresses: [] })
            this.scanContracts(networkType, accounts[0])
          }
        }
      })
    })
  }

  deploy = (account, arbitrationPrice) => async e => {
    e.preventDefault()

    console.log('deploying')
    const result = await deployCentralizedArbitrator(account, arbitrationPrice)
    window.localStorage.setItem(
      account,
      window.localStorage
        .getItem(account)
        .concat(' ')
        .concat(result._address)
    )
    this.setState({
      contractAddresses: window.localStorage.getItem(account).split(' ')
    })
  }

  handleCentralizedArbitratorDropdownKeyEnter = () => e => {
    if (e.keyCode === 13) this.setState({ selectedAddress: e.target.value })
  }

  handleCentralizedArbitratorDropdownButtonClick = () => e => {
    this.setState({ selectedAddress: e.target.innerHTML })
  }

  centralizedArbitratorButtons = addresses =>
    addresses.map(address => (
      <button
        className="dropdown-item"
        key={address}
        onClick={this.handleCentralizedArbitratorDropdownButtonClick()}
      >
        {address}
      </button>
    ))

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  notificationCallback = (notification, time) => {
    this.setState(state => ({
      notifications: [...state.notifications, { notification, time }]
    }))
  }

  clearNotificationsCallback = () => {
    console.log('clearNotifications called')
    this.setState(state => ({
      notifications: []
    }))
  }

  render() {
    console.log(`RENDERING${new Date().getTime()}`)
    const {
      arbitrationCost,
      contractAddresses,
      deployInputEnabled,
      networkType,
      notifications,
      selectedAddress,
      wallet
    } = this.state

    if (!wallet)
      return (
        <div>Please unlock your MetaMask and refresh the page to continue.</div>
      )

    return (
      <div className="container-fluid">
        {wallet && (
          <div className="row">
            <div className="col">
              <NavBar
                wallet={wallet}
                notifications={notifications}
                clearNotifications={this.clearNotificationsCallback}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col text-center">
            <h4 className="text-center">
              Select A Deployed Centralized Arbitrator
            </h4>
            <div className="row">
              <div className="col">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Please select a centralized arbitrator contract"
                    value={selectedAddress}
                    disabled
                  />
                  <div className="input-group-append">
                    <button
                      aria-expanded="false"
                      aria-haspopup="true"
                      className="btn btn-secondary dropdown-toggle primary"
                      data-toggle="dropdown"
                      id="dropdownMenuButton"
                      type="button"
                    >
                      Select
                    </button>
                    <div
                      aria-labelledby="dropdownMenuButton"
                      className="dropdown-menu"
                    >
                      {this.centralizedArbitratorButtons(contractAddresses)}
                      <hr />
                      <input
                        className="dropdown-item"
                        onKeyUp={this.handleCentralizedArbitratorDropdownKeyEnter()}
                        placeholder="Or enter the address manually and hit enter"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="col">
              <h4>Deploy A New Centralized Arbitrator</h4>
              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <input
                      aria-describedby="basic-addon1"
                      aria-label=""
                      className="form-control"
                      onChange={this.handleArbitrationPriceChange()}
                      placeholder="Please enter desired arbitration price (Wei)"
                      type="text"
                      value={arbitrationCost}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-primary primary"
                        onClick={this.deploy(wallet, arbitrationCost)}
                        type="button"
                      >
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="secondary" />
        {selectedAddress && (
          <div>
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <ArbitrationPrice
                  activeWallet={wallet}
                  contractAddress={selectedAddress}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <DisputeList
                  activeWallet={wallet}
                  contractAddress={selectedAddress}
                  networkType={networkType}
                  notificationCallback={this.notificationCallback}
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
