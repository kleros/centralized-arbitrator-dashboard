import web3 from './ethereum/web3'
import React from 'react';
import {arbitratorInstance, getOwner, getArbitrationCost, getDispute, getDisputeStatus, setArbitrationPrice, disputeCreationEvent} from './ethereum/centralizedArbitrator'
import {arbitrableInstanceAt} from './ethereum/multipleArbitrableTransaction'
import Disputes from './Disputes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      owner: "",
      arbitrationCost: "",
      disputes: [],
      metaEvidences: {}
    }

  }
  async componentDidMount(){
    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost("")
    this.setState({owner, arbitrationCost})

    let result
    arbitratorInstance.events.DisputeCreation({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
        this.addDispute(event)
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', console.error);

  }

  updateMetaEvidence = async (event) => {
    console.log(event)
    let metaEvidences = this.state.metaEvidences
    metaEvidences[parseInt(event.returnValues._metaEvidenceID)] = "event.returnValues._evidence"
    this.setState({metaEvidences: metaEvidences})
  }

  updateEvidence = async (event) => {
    console.log(event)

  }

  updateDispute = async (event, arbitrableAddress) => {
    console.log("Check this out?")

    console.log(event)
    let disputeID = parseInt(event.returnValues._disputeID)
    let metaEvidenceID = parseInt(event.returnValues._metaEvidenceID)

    let disputes = this.state.disputes
    arbitrableInstanceAt(arbitrableAddress).events.MetaEvidence({_metaEvidenceID: metaEvidenceID ,fromBlock: 0, toBlock: "latest"})
      .on('data', (event) => {
          disputes[disputeID].metaevidence = fetch(event.returnValues._evidence)
            .then(function(response) {
              return response.json()
            })
            .then(function(result){
              return result
            })
      })

    this.setState({disputes: disputes})
    console.log("Check this out")
    console.log(this.state.disputes)
  }


  updateRuling = async (event) => {
    let disputes = this.state.disputes
    disputes[parseInt(event.returnValues._disputeID)].ruling = event.returnValues[3]
    disputes[event.returnValues._disputeID].status = await getDisputeStatus(event.returnValues._disputeID)
    this.setState({disputes: disputes})
  }



  addDispute = async (event) => {

    let disputes = this.state.disputes
    let disputeID = event.returnValues._disputeID

    let dispute = await getDispute(disputeID)
    console.log(dispute)
    const length = disputes.push(dispute)
    disputes[length-1].key = disputeID

    let arbitrableAddress = event.returnValues._arbitrable

    arbitrableInstanceAt(arbitrableAddress).events.Ruling({filter: {_arbitrator: '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913'}, fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      this.updateRuling(event)
    })

    arbitrableInstanceAt(arbitrableAddress).events.MetaEvidence({fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      this.updateMetaEvidence(event)
    })

    arbitrableInstanceAt(arbitrableAddress).events.Evidence({filter: {_arbitrator: '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913'}, fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      console.log("Evidence")
      this.updateDispute(event)
    })

    arbitrableInstanceAt(arbitrableAddress).events.Dispute({filter: {_arbitrator: '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913'}, fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      console.log(event)
      this.updateDispute(event, arbitrableAddress)
    })

    this.setState({disputes: disputes})
  }


  setArbitrationCost = async (newCost) => {
    this.setState({arbitrationCost: "awaiting..."})
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost("")
    this.setState({arbitrationCost})
  }


  render() {
    return (
      <div>
        <h4>Owner: {web3.eth.accounts[0] == this.state.owner ? "You" : this.state.owner}</h4>
        <h4>Arbitrator: {arbitratorInstance.options.address} </h4>
        <form onSubmit={(e) => {e.preventDefault();this.setArbitrationCost(this.state.arbitrationCost)}}>
          <label>
            Arbitration Price: <input type="text" value={this.state.arbitrationCost} onChange={(e) => {this.setState({arbitrationCost: e.target.value})}} />
            <input type="submit" value="Change Price" />
          </label>
        </form>
        <Disputes items={this.state.disputes}/>
      </div>
    )
  }
}

export default Dashboard
