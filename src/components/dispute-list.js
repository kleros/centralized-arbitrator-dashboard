import {
  centralizedArbitratorInstance,
  getDispute,
  getDisputeStatus
} from '../ethereum/centralized-arbitrator'
import Archon from '@kleros/archon'
import Dispute from './dispute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import { arbitrableInstanceAt } from '../ethereum/arbitrable'

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

  fetchAndAssignEvidence = async (disputeID, evidence) => {
    const { disputes } = this.state
    const targetIndex = disputes.findIndex(d => d.id === disputeID)
    console.log('do we have the dispute?')
    console.log(disputes[targetIndex])
    console.log('disputeID')
    console.log(disputeID)
    console.log('disputes')
    console.log(disputes)
    console.log('evidence')
    console.log(evidence)

    disputes[targetIndex].evidences = disputes[targetIndex].evidences || {}
    disputes[targetIndex].evidences[evidence.submittedBy] =
      disputes[targetIndex].evidences[evidence.submittedBy] || []

    console.log('evidence')
    console.log(evidence)

    disputes[targetIndex].evidences[evidence.submittedBy].push(evidence)

    this.setState({ disputes })
  }

  fetchAndAssignMetaevidence = async (disputeID, evidence) => {
    const { disputes } = this.state

    console.log('fetchlog archon')
    console.log(evidence)

    console.log('disputes')
    console.log(disputes)
    console.log('disputeID')
    console.log(disputeID)

    const targetIndex = disputes.findIndex(d => d.id === disputeID)

    disputes[targetIndex].metaevidence = evidence.metaEvidenceJSON
    disputes[targetIndex].metaevidenceObject = evidence

    this.setState({ disputes })
  }

  assignMetaEvidenceUsingArchon = () => {}

  addDispute = async (disputeID, arbitrableAddress, isNew) => {
    const { archon, contractAddress, notificationCallback } = this.props

    console.log('ARGSASDASD')
    console.log(arbitrableAddress)

    const dispute = await getDispute(
      centralizedArbitratorInstance(contractAddress),
      disputeID
    )
    if (dispute.status === '2') return

    const date = new Date()

    if (isNew)
      notificationCallback(
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
    const filter = { _arbitrator: contractAddress, _disputeID: disputeID }
    const options = { filter, fromBlock: 0 }

    arbitrable
      .getPastEvents('Dispute', options)
      .then(events =>
        events.map(event =>
          archon.arbitrable
            .getMetaEvidence(
              arbitrableAddress,
              event.returnValues._metaEvidenceID
            )
            .then(x => this.fetchAndAssignMetaevidence(disputeID, x))
        )
      )

    console.log('testing getevidence')
    archon.arbitrable
      .getEvidence(arbitrableAddress, contractAddress, disputeID, {})
      .then(x => {
        console.log(x)
        console.log('HELLO')
      })

    archon.arbitrable
      .getEvidence(arbitrableAddress, contractAddress, disputeID)
      .then(evidences =>
        evidences.map(evidence =>
          this.fetchAndAssignEvidence(disputeID, evidence)
        )
      )

    arbitrable.events
      .Dispute({
        filter
      })
      .on('data', event => {
        archon.arbitrable
          .getMetaEvidence(arbitrableAddress, event.returnValues._disputeID)
          .console.log('new dispute')
      })

    this.subscriptions.push(
      arbitrableInstanceAt(arbitrableAddress)
        .events.Evidence({
          filter
        })
        .on('data', event => {
          archon.arbitrable
            .getEvidence(arbitrableAddress, contractAddress, disputeID, {
              fromBlock: event.blockNumber
            })
            // .then(evidence => console.log(evidence))
            .then(evidence => this.fetchAndAssignEvidence(disputeID, evidence))
        })
    )
  }

  disputeComponents = (contractAddress, networkType, activeWallet, items) => {
    const { archon } = this.props
    return items
      .sort(function(a, b) {
        return a.id - b.id
      })
      .map(item => (
        <Dispute
          activeWallet={activeWallet}
          arbitrated={item.arbitrated}
          archon={archon}
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
          metaevidenceObject={item.metaevidenceObject}
          networkType={networkType}
          status={item.status || '0'}
        />
      ))
  }

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

        <table className="table" id="disputes">
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
  archon: PropTypes.instanceOf(Archon).isRequired,
  contractAddress: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
  notificationCallback: PropTypes.func.isRequired
}

export default DisputeList
