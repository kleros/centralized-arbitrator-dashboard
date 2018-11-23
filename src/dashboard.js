import React from 'react'

import web3 from './ethereum/web3'
import {
  arbitratorInstance,
  getOwner,
  getArbitrationCost,
  getDispute,
  getDisputeStatus,
  setArbitrationPrice
} from './ethereum/centralized-arbitrator'
import { arbitrableInstanceAt } from './ethereum/arbitrable'
import DisputeList from './dispute-list'
import Identicon from './identicon.js'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      owner: '',
      arbitrationCost: '',
      disputes: [],
      contractAddresses: []
    }
  }
  async componentDidMount() {
    console.warn("FETCH")
    fetch('http://api.etherscan.io/api?module=account&action=txlist&address=0x00B5ADe4ac1fE9cCc08Addc2C10070642335117F&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV').then(response =>
      response
        .json()
        .then(data => {console.log((data.result).filter(({to}) => to === '').map(item => item.contractAddress))})
        
    )


    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost('')
    this.setState({ owner, arbitrationCost })

    arbitratorInstance.events
      .DisputeCreation({}, { fromBlock: 0, toBlock: 'latest' })
      .on('data', event => {
        this.addDispute(
          event.returnValues._disputeID,
          event.returnValues._arbitrable
        )
      })
      .on('error', console.error)
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
    const dispute = await getDispute(disputeID)
    // dispute.key = disputeID
    dispute.id = disputeID
    dispute.evidences = {}

    this.setState(state => ({
      disputes: [...state.disputes, dispute]
    }))

    await arbitrableInstanceAt(arbitrableAddress)
      .events.Dispute({
        filter: {
          _arbitrator: arbitratorInstance.options.address,
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
          _arbitrator: arbitratorInstance.options.address,
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
          _arbitrator: arbitratorInstance.options.address,
          _disputeID: disputeID
        },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        this.updateRuling(event)
      })
  }

  setArbitrationCost = async newCost => {
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost('')
    this.setState({ arbitrationCost })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost('')
    this.setState({ arbitrationCost })
  }

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  render() {
    const { owner, arbitrationCost, disputes } = this.state
    return (
      <div className="">
        <div className="modal-body row">
          <div className="col-md-6">
            <Identicon
              title="Owner"
              seed={owner}
              size={10}
              scale={3}
              color="#009AFF"
              bgColor="#4004A3"
              spotColor="white"
              className="identicon"
            >
              {owner}
            </Identicon>
          </div>
          <div className="col-md-6">
            <Identicon
              title="Centralized Arbitrator"
              seed={arbitratorInstance.options.address}
              size={10}
              scale={3}
              color="#009AFF"
              bgColor="#4004A3"
              spotColor="white"
              className="identicon"
            >
              {arbitratorInstance.options.address}
            </Identicon>
          </div>
        </div>
        <hr className="secondary" />
        <form
          onSubmit={this.handleSetArbitrationPriceButtonClick(arbitrationCost)}
        >
          <label>
            Arbitration Price:{' '}
            <input
              type="text"
              value={arbitrationCost}
              onChange={this.handleArbitrationPriceChange()}
            />
            <input className="primary" type="submit" value="Change Price" />
          </label>
        </form>
        <hr />
        <DisputeList items={disputes} />
      </div>
    )
  }
}

export default Dashboard
