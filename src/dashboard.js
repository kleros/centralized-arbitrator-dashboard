import { RateLimiter } from 'limiter'
import React from 'react'
import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import NavBar from './navbar.js'
import { arbitrableInstanceAt } from './ethereum/arbitrable'
import {
  arbitratorInstance,
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

  async componentDidMount() {
    if (window.web3 && window.web3.currentProvider.isMetaMask)
      window.web3.eth.getAccounts((error, accounts) => {
        this.setState({ wallet: accounts[0] })

        console.warn('FETCH')
        const limiter = new RateLimiter(1, 250)

        fetch(
          `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${
            accounts[0]
          }&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
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
                    `https://api-kovan.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
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
        className="dropdown-item"
        key={address}
        onClick={e => this.setState({ selectedAddress: e.target.innerHTML })}
      >
        {address}
      </button>
    ))

  render() {
    console.log(`RENDERING${new Date().getTime()}`)
    console.log(this.state.selectedAddress)
    const {
      contractAddresses,
      selectedAddress,
      owner,
      arbitrationCost
    } = this.state

    return (
      <div className="">
        {this.state.wallet &&
          <div className="row">
            <div className="col">
              <NavBar wallet={this.state.wallet}/>
            </div>
          </div>
        }
        <div className="row">
          <div className="col">
            <Identicon
              bgColor="#4004A3"
              className="identicon"
              color="#009AFF"
              scale={3}
              seed={selectedAddress}
              size={10}
              spotColor="white"
              title="Centralized Arbitrator"
            />

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
                  placeholder="Enter a contract address manually"
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
