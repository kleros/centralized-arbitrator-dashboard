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

class DisputeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disputes: []
    }
    this.subscriptions = {
      dispute: undefined,
      disputeCreation: undefined,
      evidence: undefined,
      metaevidence: undefined,
      ruling: undefined
    }

    this.gateway = 'https://ipfs.io'
  }

  componentDidMount() {
    const { contractAddress } = this.props

    const centralizedArbitrator = centralizedArbitratorInstance(contractAddress)

    centralizedArbitrator
    .getPastEvents('DisputeCreation', {fromBlock: 0}, function(error, events){
      console.log(events)
    })
    .then((events) => {
      console.log("inside then")
      console.log(events)
      events.map(event => this.addDispute(event.returnValues._disputeID, event.returnValues._arbitrable))
    })

    this.subscriptions.disputeCreation = centralizedArbitrator.events.DisputeCreation()
    .on('data', event => this.addDispute(event.returnValues._disputeID, event.returnValues._arbitrable))

  }

  componentDidUpdate(prevProps) {
    const { contractAddress } = this.props

    if (contractAddress !== prevProps.contractAddress) {
      if (this.subscriptions.disputeCreation)
        this.subscriptions.disputeCreation.unsubscribe()
      if (this.subscriptions.dispute) this.subscriptions.dispute.unsubscribe()
      if (this.subscriptions.evidence) this.subscriptions.evidence.unsubscribe()
      if (this.subscriptions.subscriptions)
        this.subscriptions.ruling.unsubscribe()
      if (this.subscriptions.metaevidence)
        this.subscriptions.metaevidence.unsubscribe()
      this.subscriptions = {}
      this.setState({ disputes: [] })
      this.subscriptions.disputeCreation = centralizedArbitratorInstance(
        contractAddress
      )
        .events.DisputeCreation({}, { fromBlock: 0, toBlock: 'latest' })
        .on('data', event => {
          this.addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable
          )
        })
        .on('error', console.error)
    }
  }

  updateEvidence = async (disputeID, party, evidence) => {
    const { disputes } = this.state
    const dispute = disputes.filter(d => d.id === disputeID)[0]
    dispute.evidences = dispute.evidences || {}
    dispute.evidences[party] = dispute.evidences[party] || []

    console.log('evidence')
    console.log(evidence)

    fetch(this.gateway + evidence).then(response =>
      response
        .json()
        .catch(function() {
          console.log('error')
        })
        .then(data => dispute.evidences[party].push(data))
    )
  }

  updateDispute = async (arbitrableAddress, disputeID, metaEvidenceID) => {
    const { disputes } = this.state

    console.log('disputes')
    console.log(disputes)
    console.log('disputeID')
    console.log(disputeID)

    this.subscriptions.metaevidence = arbitrableInstanceAt(arbitrableAddress)
      .events.MetaEvidence({
        filter: { _metaEvidenceID: metaEvidenceID },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        fetch(this.gateway + event.returnValues._evidence)
          .then(response =>
            response
              .json()
              .catch(function() {
                console.log('error')
              })
              .then(
                data =>
                  (disputes.filter(
                    d => d.id === disputeID
                  )[0].metaevidence = data)
              )
          )
          .then(() => this.setState({ disputes }))
      })
  }

  updateRuling = async event => {
    const { disputes } = this.state
    const disputeID = parseInt(event.returnValues._disputeID)
    const dispute = disputes.filter(d => d.id === disputeID)[0]

    dispute.ruling = event.returnValues[3]
    dispute.status = await getDisputeStatus(event.returnValues._disputeID)

    this.setState({ disputes })
  }

  addDispute = async (disputeID, arbitrableAddress) => {
    this.props.notificationCallback()
    const { contractAddress } = this.props

    const dispute = await getDispute(
      centralizedArbitratorInstance(contractAddress),
      disputeID
    )
    // dispute.key = disputeID
    dispute.id = disputeID
    dispute.evidences = {}

    this.setState(state => ({
      disputes: [...state.disputes, dispute]
    }))

    this.subscriptions.dispute = await arbitrableInstanceAt(arbitrableAddress)
      .events.Dispute({
        filter: {
          _arbitrator: contractAddress,
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

    this.subscriptions.evidence = await arbitrableInstanceAt(arbitrableAddress)
      .events.Evidence({
        filter: {
          _arbitrator: contractAddress,
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

    this.subscriptions.ruling = await arbitrableInstanceAt(arbitrableAddress)
      .events.Ruling({
        filter: {
          _arbitrator: contractAddress,
          _disputeID: disputeID
        },
        fromBlock: 0,
        toBlock: 'latest'
      })
      .on('data', event => {
        this.updateRuling(event)
      })
  }

  disputes = (contractAddress, networkType, activeWallet, items) =>
    items
      .filter(dispute => dispute.status !== '2')
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
          metaevidence={item.metaevidence || 'NO META EVIDENCE'}
          networkType={networkType}
          status={item.status || '0'}
        />
      ))

  render() {
    const { activeWallet, contractAddress, networkType } = this.props
    const { disputes } = this.state
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

          {this.disputes(contractAddress, networkType, activeWallet, disputes)}
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
