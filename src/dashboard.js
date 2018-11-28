import { RateLimiter } from 'limiter'
import React from 'react'

import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import { arbitrableInstanceAt } from './ethereum/arbitrable'
import {
  arbitratorInstance,
  getOwner,
  getDispute,
  getDisputeStatus
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

  async componentDidMount() {
    if (window.web3 && window.web3.currentProvider.isMetaMask)
      window.web3.eth.getAccounts((error, accounts) => {
        this.setState({ wallet: accounts[0] })

        console.warn('FETCH')
        const limiter = new RateLimiter(1, 250)

        fetch(
          'https://api-kovan.etherscan.io/api?module=account&action=txlist&address=' +
            accounts[0] +
            '&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV'
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
                    'https://api-kovan.etherscan.io/api?module=contract&action=getsourcecode&address=' +
                      address +
                      '&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV'
                  )
                    .then(response => response.json())
                    .then(data => {
                      if (
                        data.result[0].ContractName == 'CentralizedArbitrator'
                      )
                        this.setState(state => ({
                          contractAddresses: [
                            ...state.contractAddresses,
                            address
                          ]
                        }))
                    })
              )
            )
          )
      })
    else console.log('MetaMask account not detected :(')

    this.setState({
      selectedAddress: this.state.contractAddresses[0]
    })
  }

  async componentDidUpdate() {
    console.log(this.state.contractAddresses)
  }

  owner = () => getOwner(arbitratorInstance(this.state.selectedAddress))

  centralizedArbitratorButtons = addresses =>
    addresses.map(address => (
      <button
        key={address}
        className="dropdown-item"
        onClick={e => this.setState({ selectedAddress: e.target.innerHTML })}
      >
        {address}
      </button>
    ))

  render() {
    console.log('RENDERING' + new Date().getTime())
    console.log(this.state.selectedAddress)
    const {
      contractAddresses,
      selectedAddress,
      owner,
      arbitrationCost
    } = this.state

    return (
      <div className="">
        <div className="row">
          <div className="col">
            <Identicon
              title="Centralized Arbitrator"
              seed={selectedAddress}
              size={10}
              scale={3}
              color="#009AFF"
              bgColor="#4004A3"
              spotColor="white"
              className="identicon"
            />

            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle primary"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {selectedAddress}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {this.centralizedArbitratorButtons(contractAddresses)}
                <hr />
                <input
                  className="dropdown-item"
                  placeholder="Enter a contract address manually"
                  onKeyUp={e =>
                    e.keyCode == 13 &&
                    this.setState({ selectedAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="secondary" />
        {selectedAddress && (
          <div>
            <div className="row">
              <div className="col">
                <ArbitrationPrice contractAddress={selectedAddress} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <DisputeList contractAddress={selectedAddress} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Dashboard
