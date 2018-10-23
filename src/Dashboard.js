import web3 from './ethereum/web3'
import React from 'react';
import {arbitratorInstance, getOwner, getArbitrationCost, getDisputeStatus, setArbitrationPrice, disputeCreationEvent} from './ethereum/centralizedArbitrator'
import {arbitrableInstanceAt} from './ethereum/multipleArbitrableTransaction'
import Disputes from './Disputes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      owner: "",
      arbitrationCost: "",
      disputes: []
    }
  }
  async componentDidMount(){
    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost("")
    this.setState({owner, arbitrationCost})

    // let disputes = await Promise.all([0,1,2,3,4].map(async x => getDispute(x)))
    // for(let key = 0; key < 5; key++){
    //   disputes[key].key = key
    // }
    // console.log(disputes)
    // this.setState({disputes})

    let result
    arbitratorInstance.events.DisputeCreation({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
        console.log(event); // same results as the optional callback above
        this.addDispute(event)
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', console.error);


  }

  addDispute = (event) => {
    let disputes = this.state.disputes
    disputes.push({key: event.returnValues._disputeID, arbitrable: event.returnValues._arbitrable})

    arbitrableInstanceAt(event.returnValues._arbitrable).events.Ruling({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      console.log(event)
      this.updateDispute(event)
    })

    this.setState({disputes: disputes})
  }

  updateDispute = async (event) => {
    let disputes = this.state.disputes
    disputes[event.returnValues._disputeID].ruling = event.returnValues[3]
    disputes[event.returnValues._disputeID].status = await getDisputeStatus(event.returnValues._disputeID)
    this.setState({disputes: disputes})
    console.log(this.state.disputes)
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
        <label>
          Owner: {this.state.owner}
        </label>

        <form onSubmit={(e) => {e.preventDefault();this.setArbitrationCost(this.state.arbitrationCost)}} >
          <label>
            Arbitration cost: <input type="text" value={this.state.arbitrationCost} onChange={(e) => {this.setState({arbitrationCost: e.target.value})}} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <Disputes items={this.state.disputes}/>
      </div>
    )
  }
}

export default Dashboard
