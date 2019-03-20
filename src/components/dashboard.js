import $ from 'jquery'
import ArbitrationPrice from './arbitration-price'
import Archon from '@kleros/archon'
import DisputeList from './dispute-list'
import NavBar from './navbar.js'
import { RateLimiter } from 'limiter'
import React from 'react'
import { deployCentralizedArbitrator } from '../ethereum/centralized-arbitrator'
import web3 from '../ethereum/web3'
import Identicon from './identicon.js'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arbitrationCost: '',
      contractAddresses: [],
      notifications: [],
      owner: '',
      selectedAddress: undefined,
      uglyFixtoBug13: '' // See https://github.com/kleros/centralized-arbitrator-dashboard/issues/13
    }
  }

  eventNotificationServiceRoute(address, eventName, networkName) {
    if (networkName === 'main')
      return `https://events.kleros.io/contracts/${address}/listeners/${eventName}/callbacks`
    else
      return `https://kovan-events.kleros.io/contracts/${address}/listeners/${eventName}/callbacks`
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

                  // Call eventNotificationService here

                  if (!window.localStorage.getItem(account))
                    window.localStorage.setItem(account, address)
                  else
                    window.localStorage.setItem(
                      account,
                      window.localStorage
                        .getItem(account)
                        .concat(' ')
                        .concat(address)
                    )
                }
              })
          )
        )
      )
  }

  apiPrefix = networkType => {
    console.log('apiPrefix')
    console.log(networkType)
    switch (networkType) {
      case 'main':
        return ' '
      case 'kovan':
        return 'kovan.'
      default:
        return ' '
    }
  }

  async componentDidMount() {
    this.setState({
      archon: new Archon(window.web3.currentProvider, 'https://ipfs.kleros.io')
    })

    $('*').on('click', () => {
      this.setState({ uglyFixtoBug13: '' })
    })
    const { contractAddresses } = this.state

    if (window.web3 && window.web3.currentProvider.isMetaMask)
      window.web3.eth.getAccounts((error, accounts) => {
        web3.eth.net.getNetworkType((error, networkType) => {
          if (error) console.error(error)
          console.log(accounts[0])
          this.setState({ networkType: networkType })
          this.setState({ wallet: accounts[0] })
          if (accounts[0])
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
        })
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
        this.setState({ wallet: accounts[0] })
        if (accounts[0])
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
      })
    })
  }

  deploy = (account, arbitrationPrice) => async e => {
    e.preventDefault()

    console.log('deploying')
    const result = await deployCentralizedArbitrator(
      account,
      web3.utils.toWei(arbitrationPrice, 'ether')
    )

    const item = window.localStorage.getItem(account) || ''

    console.log(item)
    window.localStorage.setItem(
      account,
      item.concat(' ').concat(result._address)
    )
    this.setState({
      contractAddresses: window.localStorage.getItem(account).split(' ')
    })
  }

  handleCentralizedArbitratorDropdownKeyEnter = () => e => {
    if (e.keyCode === 13) this.setState({ selectedAddress: e.target.value })
  }

  handleCentralizedArbitratorDropdownButtonClick = address => e => {
    this.setState({ selectedAddress: address })
  }

  centralizedArbitratorButtons = addresses =>
    addresses.map(address => (
      <div className="dropdown-item p-0" key={address}>
        <button
          className="dropdown-item "
          key={address}
          onClick={this.handleCentralizedArbitratorDropdownButtonClick(address)}
        >
          <a
            href={`https://${this.apiPrefix(
              this.state.networkType
            )}etherscan.io/address/${address}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img className="m-2" src="etherscan.svg" width="30" height="30" />
          </a>
          {address}
        </button>
      </div>
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
    this.setState(() => ({
      notifications: []
    }))
  }

  render() {
    console.log(`RENDERING${new Date().getTime()}`)
    const {
      arbitrationCost,
      archon,
      contractAddresses,
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
            <div className="col p-0">
              <NavBar
                clearNotifications={this.clearNotificationsCallback}
                networkType={networkType}
                notifications={notifications}
                wallet={wallet}
                web3={web3}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col text-center">
            <h4 className="text-center">
              Select A Deployed Centralized Arbitrator
            </h4>
            <div className="row mb-3">
              <div className="col-md-1 pb-10 mb-6 align-top">
                <Identicon
                  bgColor="#4004A3"
                  className="identicon rounded-circle"
                  color="#009AFF"
                  networkType={networkType}
                  scale={3}
                  seed={selectedAddress}
                  size={13}
                  spotColor="white"
                />
              </div>
              <div className="col p-0">
                <div className="input-group">
                  <input
                    className="form-control"
                    disabled
                    placeholder="Please select a centralized arbitrator contract"
                    type="text"
                    value={selectedAddress}
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
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <h5 className="text-center my-3">Contract Addresses</h5>
                      <div class="dropdown-divider" />

                      {this.centralizedArbitratorButtons(contractAddresses)}
                      <div class="dropdown-divider" />
                      <div className="px-3 m-3">
                        <label className="px-3">
                          <b>Enter Custom Address</b>
                        </label>
                        <div class="input-group px-3">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="0x..."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={this.state.customAddressValue}
                            onChange={e =>
                              this.setState({
                                customAddressValue: e.target.value
                              })
                            }
                          />
                          <div class="input-group-append">
                            <button
                              class="btn btn-outline-secondary primary"
                              type="button"
                              onClick={this.handleCentralizedArbitratorDropdownButtonClick(
                                this.state.customAddressValue
                              )}
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
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
                      placeholder="Please enter desired arbitration price (ETH)"
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
              <div className="col-md-6 offset-md-3 pt-3">
                <ArbitrationPrice
                  activeWallet={wallet}
                  contractAddress={selectedAddress}
                  web3={web3}
                />
              </div>
            </div>
            <hr />
            <div className="row my-5">
              <div className="col">
                <div className="disputes">
                  {selectedAddress && wallet && (
                    <DisputeList
                      activeWallet={wallet}
                      archon={archon}
                      contractAddress={selectedAddress}
                      networkType={networkType}
                      notificationCallback={this.notificationCallback}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Dashboard
