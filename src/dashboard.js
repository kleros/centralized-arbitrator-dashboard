import React from 'react'
import {RateLimiter} from 'limiter'

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
import ContractSelector from './contract-selector'
import Identicon from './identicon.js'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      owner: '',
      arbitrationCost: '',
      disputes: [],
      contractAddresses: [],
      selectedAddress: '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913'
    }

  }
  async componentDidMount() {
    console.warn("FETCH")
    let limiter = new RateLimiter(1, 300);

    fetch('http://api.etherscan.io/api?module=account&action=txlist&address=0x00B5ADe4ac1fE9cCc08Addc2C10070642335117F&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV')
    .then(response => response.json())
    .then(data => (data.result).filter(({to}) => to === '').map(item => item.contractAddress))
    .then(addresses =>
      addresses.map(address => (limiter.removeTokens(1, async () => await(
        fetch('https://api.etherscan.io/api?module=contract&action=getsourcecode&address=' + address + '&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV').then(response => response.json())
        .then(data =>  { if(data.result[0].ContractName == "Kleros")
              this.setState(state => ({
              contractAddresses: [...state.contractAddresses, address]
            }));}
      ))
    ))))



    const owner = await getOwner(arbitratorInstance(this.state.selectedAddress))
    const arbitrationCost = await getArbitrationCost(arbitratorInstance(this.state.selectedAddress) ,'')
    this.setState({ owner, arbitrationCost })

    arbitratorInstance(this.state.selectedAddress).events
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
    const dispute = await getDispute(arbitratorInstance(this.state.selectedAddress), disputeID)
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

  setArbitrationCost = async newCost => {
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost(arbitratorInstance(this.state.selectedAddress), '')
    this.setState({ arbitrationCost })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost(arbitratorInstance(this.state.selectedAddress), '')
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
      <div className="row">
        <div className="col">
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
        <div className="col">
          <Identicon
            title="Centralized Arbitrator"
            seed={this.state.selectedAddress}
            size={10}
            scale={3}
            color="#009AFF"
            bgColor="#4004A3"
            spotColor="white"
            className="identicon"
          >
            {arbitratorInstance(this.state.selectedAddress)}
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
