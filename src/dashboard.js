import {
  centralizedArbitratorInstance,
  deployCentralizedArbitrator,
  getOwner
} from './ethereum/centralized-arbitrator'
import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import Identicon from './identicon.js'
import NavBar from './navbar.js'
import { RateLimiter } from 'limiter'
import React from 'react'
import web3 from './ethereum/web3'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arbitrationCost: '1',
      contractAddresses: [],
      owner: '',
      selectedAddress: undefined
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
                if (data.result[0].ContractName === 'CentralizedArbitrator')
                  this.setState(state => ({
                    contractAddresses: [...state.contractAddresses, address]
                  }))
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

        web3.eth.net.getNetworkType((error, networkType) => {
          if (error) console.error(error)

          this.setState({ networkType: networkType })
          if (accounts[0]) this.scanContracts(networkType, accounts[0])
        })
      })
    else console.log('MetaMask account not detected :(')

    this.setState({
      selectedAddress: contractAddresses[0]
    })
  }

  owner = () => {
    const { selectedAddress } = this.state
    getOwner(centralizedArbitratorInstance(selectedAddress))
  }

  deploy = (account, arbitrationPrice) => async e => {
    e.preventDefault()
    await deployCentralizedArbitrator(account, arbitrationPrice)
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

  render() {
    console.log(`RENDERING${new Date().getTime()}`)
    const {
      arbitrationCost,
      contractAddresses,
      networkType,
      selectedAddress,
      wallet
    } = this.state

    if (!wallet)
      return (
        <div>Please unlock your MetaMask and refresh the page to continue.</div>
      )

    return (
      <div className="container">
        {wallet && (
          <div className="row">
            <div className="col">
              <NavBar wallet={wallet} />
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
                  onKeyUp={this.handleCentralizedArbitratorDropdownKeyEnter()}
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
                  className="btn btn-primary"
                  onClick={this.deploy(wallet, arbitrationCost)}
                  type="button"
                >
                  Deploy
                </button>
              </div>
              <input
                aria-describedby="basic-addon1"
                aria-label=""
                className="form-control"
                onChange={this.handleArbitrationPriceChange()}
                placeholder="Arbitration Price"
                type="text"
                value={arbitrationCost}
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
