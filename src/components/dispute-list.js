import {
  centralizedArbitratorInstance,
  getDispute,
  getDisputeStatus
} from '../ethereum/centralized-arbitrator'
import Dispute from './dispute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import { arbitrableInstanceAt } from '../ethereum/arbitrable'
import update from 'immutability-helper'

class DisputeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disputes: []
    }
    this.subscriptions = []

    this.gateway = 'https://ipfs.kleros.io'
  }

  componentDidMount() {
    const { contractAddress } = this.props

    const centralizedArbitrator = centralizedArbitratorInstance(contractAddress)

    this.getPastDisputeCreationsAndListenToNewOnes(centralizedArbitrator)
  }

  getPastDisputeCreationsAndListenToNewOnes(centralizedArbitrator) {
    centralizedArbitrator
      .getPastEvents('DisputeCreation', { fromBlock: 0 })
      .then(events =>
        events.map(event => {
          console.log('CHECKTHISOUT')
          console.log(event)
          return this.addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable,
            false
          )
        })
      )

    this.subscriptions.push(
      centralizedArbitrator.events
        .DisputeCreation()
        .on('data', event =>
          this.addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable,
            true
          )
        )
    )
  }

  componentDidUpdate(prevProps) {
    const { contractAddress } = this.props

    if (contractAddress !== prevProps.contractAddress) {
      this.subscriptions.map(subscription => subscription.unsubscribe())
      this.setState({ disputes: [] })
      const centralizedArbitrator = centralizedArbitratorInstance(
        contractAddress
      )
      this.getPastDisputeCreationsAndListenToNewOnes(centralizedArbitrator)
    }
  }

  fetchAndAssignEvidence = async (disputeID, party, evidence) => {
    const { disputes } = this.state
    const targetIndex = disputes.findIndex(d => d.id === disputeID)
    console.log('do we have the dispute?')
    console.log(disputes[targetIndex])
    console.log('disputeID')
    console.log(disputeID)
    console.log('disputes')
    console.log(disputes)

    disputes[targetIndex].evidences = disputes[targetIndex].evidences || {}
    disputes[targetIndex].evidences[party] =
      disputes[targetIndex].evidences[party] || []

    console.log('evidence')
    console.log(evidence)

    fetch(this.gateway + evidence)
      .then(response =>
        response
          .json()
          .catch(function() {
            console.log('error')
          })
          .then(data => disputes[targetIndex].evidences[party].push(data))
      )
      .then(this.setState({ disputes }))
  }

  fetchAndAssignMetaevidence = async (disputeID, evidence) => {
    const { disputes } = this.state

    console.log('fetchlog')
    console.log(evidence)

    console.log('disputes')
    console.log(disputes)
    console.log('disputeID')
    console.log(disputeID)

    const targetIndex = disputes.findIndex(d => d.id === disputeID)

    fetch(this.gateway + evidence)
      .then(response => response.json())
      .then(metaevidence => (disputes[targetIndex].metaevidence = metaevidence))
      .then(this.setState({ disputes }))
  }

  updateRuling = async event => {
    console.log('eventscheme')
    console.log(event)
    const { disputes } = this.state
    const disputeID = parseInt(event.returnValues._disputeID)
    const targetIndex = disputes.findIndex(d => d.id === disputeID)

    disputes[targetIndex].ruling = event.returnValues[2]
    disputes[targetIndex].status = await getDisputeStatus(
      event.returnValues._disputeID
    )

    this.setState({ disputes })
  }

  addDispute = async (disputeID, arbitrableAddress, isNew) => {
    const { contractAddress } = this.props

    console.log('ARGS')
    console.log(arbitrableAddress)

    const dispute = await getDispute(
      centralizedArbitratorInstance(contractAddress),
      disputeID
    )
    if (dispute.status === '2') return

    const date = new Date()

    this.props.notificationCallback(
      `New dispute #${disputeID} in contract ${contractAddress.substring(
        0,
        8
      )}...`,
      date.getTime()
    )

    dispute.id = disputeID
    dispute.evidences = {}

    await this.setState(state => ({
      disputes: [...state.disputes, dispute]
    }))

    const arbitrable = arbitrableInstanceAt(arbitrableAddress)
    const filter = { _disputeID: disputeID, _arbitrator: contractAddress }
    const options = { filter, fromBlock: 0 }

    arbitrable.getPastEvents('Dispute', options).then(events =>
      events.map(event =>
        arbitrable
          .getPastEvents('MetaEvidence', {
            filter: { _metaEvidenceID: event.returnValues._metaEvidenceID },
            fromBlock: 0
          })
          .then(events =>
            this.fetchAndAssignMetaevidence(
              disputeID,
              events[0].returnValues._evidence
            )
          )
      )
    )

    arbitrable
      .getPastEvents('Evidence', options)
      .then(events =>
        events.map(event =>
          this.fetchAndAssignEvidence(
            disputeID,
            event.returnValues._party,
            event.returnValues._evidence
          )
        )
      )
      .then(
        this.props.notificationCallback(
          `New evidence submitted to dispute #${disputeID} in contact ${contractAddress.substring(
            0,
            8
          )}...`,
          date.getTime()
        )
      )

    arbitrable
      .getPastEvents('Ruling', options)
      .then(events => events.map(event => this.updateRuling(event)))

    arbitrable.events
      .Dispute({
        filter
      })
      .on('data', event => {
        this.fetchAndAssignMetaevidence(
          event.returnValues._disputeID,
          event.returnValues._metaEvidenceID
        )
      })

    this.subscriptions.push(
      arbitrableInstanceAt(arbitrableAddress)
        .events.Evidence({
          filter
        })
        .on('data', event => {
          this.fetchAndAssignEvidence(
            disputeID,
            event.returnValues._party,
            event.returnValues._evidence
          )
        })
    )

    this.subscriptions.push(
      arbitrableInstanceAt(arbitrableAddress)
        .events.Ruling({
          filter
        })
        .on('data', event => {
          this.updateRuling(event)
        })
    )
  }

  disputeComponents = (contractAddress, networkType, activeWallet, items) =>
    items
      .sort(function(a, b) {
        return a.id - b.id
      })
      .map(item => (
        <Dispute
          activeWallet={activeWallet}
          arbitrated={item.arbitrated}
          centralizedArbitratorInstance={centralizedArbitratorInstance(
            contractAddress
          )}
          choices={item.choices}
          evidences={item.evidences}
          fee={item.fee}
          id={item.id}
          ipfsGateway={this.gateway}
          key={item.id}
          metaevidence={item.metaevidence}
          networkType={networkType}
          status={item.status || '0'}
        />
      ))

  render() {
    const { activeWallet, contractAddress, networkType } = this.props
    const { disputes } = this.state
    console.log('final disputes')
    console.log(disputes)
    return (
      <div>
        <h1>
          <b>Disputes That Await Your Arbitration</b>
        </h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr className="secondary">
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Ether)</th>
              <th>Status</th>
              <th>
                <FontAwesomeIcon icon="gavel" />
              </th>
            </tr>
          </thead>

          {this.disputeComponents(
            contractAddress,
            networkType,
            activeWallet,
            disputes
          )}
        </table>
      </div>
    )
  }
}

DisputeList.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired
}

export default DisputeList
