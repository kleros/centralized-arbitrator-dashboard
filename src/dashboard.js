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

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      owner: '',
      arbitrationCost: '',
      disputes: []
    }
  }
  async componentDidMount() {
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
        .then(data => sortedDisputes[disputeID].evidences[party].push(data))
    )

    console.warn('data structure')
    console.log(sortedDisputes[disputeID])
  }

  updateDispute = async (arbitrableAddress, disputeID, metaEvidenceID) => {
    const { disputes } = this.state

    console.warn('Inside Update Dispute')

    const sortedDisputes = disputes.sort(function(a, b) {
      return a.id - b.id
    })
    console.log(sortedDisputes.slice())
    console.log(disputeID)

    arbitrableInstanceAt(arbitrableAddress)
      .events.MetaEvidence({
        filter: { _metaEvidenceID: metaEvidenceID },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        console.warn('MetaEvidence')
        console.log(event)
        fetch(event.returnValues._evidence)
          .then(response =>
            response
              .json()
              .then(data => (sortedDisputes[disputeID].metaevidence = data))
          )
          .then(() => this.setState({ disputes: sortedDisputes }))
      })

    console.log(disputes)
    console.warn('Exit Update Dispute')
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
        console.warn('Calling updateDispute')
        console.log(event)
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
      <div>
        <h4>Owner: {web3.eth.accounts[0] === owner ? 'You' : owner}</h4>
        <h4>
          Arbitrator:{' '}
          <a
            href={
              'https://kovan.etherscan.io/address/' +
              arbitratorInstance.options.address
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {arbitratorInstance.options.address}
          </a>
        </h4>
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
            <input type="submit" value="Change Price" />
          </label>
        </form>
        <br />
        <DisputeList items={disputes} />
      </div>
    )
  }
}

export default Dashboard
