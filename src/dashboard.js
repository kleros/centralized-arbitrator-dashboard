import { RateLimiter } from 'limiter'
import React from 'react'

import ArbitrationPrice from './arbitration-price'
import DisputeList from './dispute-list'
import { arbitrableInstanceAt } from './ethereum/arbitrable'
import {
  arbitratorInstance,
  getOwner,
  getArbitrationCost,
  getDispute,
  getDisputeStatus,
  setArbitrationPrice
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
          'http://api-kovan.etherscan.io/api?module=account&action=txlist&address=' +
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

  updateEvidence = async (disputeID, party, evidence) => {
    const { disputes } = this.state

    const sortedDisputes = disputes.sort(function(a, b) {
      return a.id - b.id
    })

    sortedDisputes[disputeID].evidences[party] =
      sortedDisputes[disputeID].evidences[party] || []

    fetch(evidence).then(response =>
      response
        .json()
        .catch(function() {
          console.log('error')
        })
        .then(data => sortedDisputes[disputeID].evidences[party].push(data))
    )
  }

  updateDispute = async (arbitrableAddress, disputeID, metaEvidenceID) => {
    const { disputes } = this.state

    const sortedDisputes = disputes.sort(function(a, b) {
      return a.id - b.id
    })

    arbitrableInstanceAt(arbitrableAddress)
      .events.MetaEvidence({
        filter: { _metaEvidenceID: metaEvidenceID },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        fetch(event.returnValues._evidence)
          .then(response =>
            response
              .json()
              .catch(function() {
                console.log('error')
              })
              .then(data => (sortedDisputes[disputeID].metaevidence = data))
          )
          .then(() => this.setState({ disputes: sortedDisputes }))
      })
  }

  updateRuling = async event => {
    const { disputes } = this.state
    disputes[parseInt(event.returnValues._disputeID)].ruling =
      event.returnValues[3]
    disputes[event.returnValues._disputeID].status = await getDisputeStatus(
      event.returnValues._disputeID
    )
    this.setState({ disputes: disputes })
  }

  addDispute = async (disputeID, arbitrableAddress) => {
    const dispute = await getDispute(
      arbitratorInstance(this.state.selectedAddress),
      disputeID
    )
    // dispute.key = disputeID
    dispute.id = disputeID
    dispute.evidences = {}

    this.setState(state => ({
      disputes: [...state.disputes, dispute]
    }))

    await arbitrableInstanceAt(arbitrableAddress)
      .events.Dispute({
        filter: {
          _arbitrator: this.state.selectedAddress,
          _disputeID: disputeID
        },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        this.updateDispute(
          arbitrableAddress,
          event.returnValues._disputeID,
          event.returnValues._metaEvidenceID
        )
      })

    await arbitrableInstanceAt(arbitrableAddress)
      .events.Evidence({
        filter: {
          _arbitrator: this.state.selectedAddress,
          _disputeID: disputeID
        },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        this.updateEvidence(
          disputeID,
          event.returnValues._party,
          event.returnValues._evidence
        )
      })

    await arbitrableInstanceAt(arbitrableAddress)
      .events.Ruling({
        filter: {
          _arbitrator: this.state.selectedAddress,
          _disputeID: disputeID
        },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        this.updateRuling(event)
      })
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
